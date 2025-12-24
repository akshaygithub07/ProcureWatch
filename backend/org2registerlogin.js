/*
 * Copyright IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const express = require('express');
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        // 1. Load Org2 connection profile
        const ccpPath = path.resolve(
            '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.json'
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // 2. Create CA client
        const caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;

        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName
        );

        // 3. Create wallet
        const walletPath = '/home/akshay/ProcureWatch/ProcureWatch/backend/wallet';
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // 4. Check if Org2 Admin already exists
        const adminIdentity = await wallet.get('org2Admin');
        if (adminIdentity) {
            return res.status(409).json({
                success: false,
                message: 'Org2 Admin already exists in wallet'
            });
        }

        // 5. Enroll Org2 Admin with CA
        const enrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: 'Org2MSP',
            type: 'X.509'
        };

        // 6. Store identity in wallet
        await wallet.put('org2Admin', x509Identity);

        return res.status(201).json({
            success: true,
            message: 'Org2 Admin enrolled successfully',
            identity: 'org2Admin'
        });

    } catch (error) {
        console.error('❌ Failed to enroll Org2 admin:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


router.post('/register-company', async (req, res) => {
    try {
        const { companyId, uuid } = req.body;

        if (!companyId || !uuid) {
            return res.status(400).json({
                success: false,
                message: 'companyId and uuid are required'
            });
        }

        // 1. Load Org2 connection profile
        const ccpPath =
            '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.json';

        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // 2. Create CA client
        const caURL = ccp.certificateAuthorities['ca.org2.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // 3. Create wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // 4. Check if company already exists
        const userIdentity = await wallet.get(companyId);
        if (userIdentity) {
            return res.status(409).json({
                success: false,
                message: `Company ${companyId} already exists`
            });
        }

        // 5. Check if Org2 Admin exists
        const adminIdentity = await wallet.get('org2Admin');
        if (!adminIdentity) {
            return res.status(401).json({
                success: false,
                message: 'Org2 admin not enrolled'
            });
        }

        // 6. Build admin user context
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'org2Admin');

        // 7. Register company
        const secret = await ca.register(
            {
                affiliation: 'org2.department1',
                enrollmentID: companyId,
                role: 'client',
                attrs: [
                    { name: 'role', value: 'company', ecert: true },
                    { name: 'uuid', value: uuid, ecert: true }
                ]
            },
            adminUser
        );

        // 8. Enroll company
        const enrollment = await ca.enroll({
            enrollmentID: companyId,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: 'role', optional: false },
                { name: 'uuid', optional: false }
            ]
        });

        // 9. Store identity in wallet
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: 'Org2MSP',
            type: 'X.509'
        };

        await wallet.put(companyId, x509Identity);

        return res.status(201).json({
            success: true,
            message: 'Company registered successfully',
            companyId
        });

    } catch (error) {
        console.error(' Company registration failed:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/register-vendor', async (req, res) => {
    try {
        const { vendorId, uuid } = req.body;

        if (!vendorId || !uuid) {
            return res.status(400).json({
                success: false,
                message: 'vendorId and uuid are required'
            });
        }

        // Load Org2 connection profile
        const ccpPath =
            '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.json';

        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // CA client
        const caURL = ccp.certificateAuthorities['ca.org2.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if vendor already exists
        const userIdentity = await wallet.get(vendorId);
        if (userIdentity) {
            return res.status(409).json({
                success: false,
                message: `Vendor ${vendorId} already exists`
            });
        }

        // Check Org2 Admin
        const adminIdentity = await wallet.get('org2Admin');
        if (!adminIdentity) {
            return res.status(401).json({
                success: false,
                message: 'Org2 admin identity not found'
            });
        }

        // Admin context
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'org2Admin');

        // Register vendor
        const secret = await ca.register(
            {
                affiliation: 'org2.department1',
                enrollmentID: vendorId,
                role: 'client',
                attrs: [
                    { name: 'role', value: 'vendor', ecert: true },
                    { name: 'uuid', value: uuid, ecert: true }
                ]
            },
            adminUser
        );

        // Enroll vendor
        const enrollment = await ca.enroll({
            enrollmentID: vendorId,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: 'role', optional: false },
                { name: 'uuid', optional: false }
            ]
        });

        // Store in wallet
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: 'Org2MSP',
            type: 'X.509'
        };

        await wallet.put(vendorId, x509Identity);

        return res.status(201).json({
            success: true,
            message: 'Vendor registered successfully',
            vendorId
        });

    } catch (error) {
        console.error(' Vendor registration failed:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});



module.exports = router;
