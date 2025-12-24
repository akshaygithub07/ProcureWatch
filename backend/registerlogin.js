'use strict';

const express = require('express');
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/* REGISTER + ENROLL NEW ADMIN */
router.post('/register', async (req, res) => {
    try {
        const { adminId, adminSecret } = req.body;

        if (!adminId || !adminSecret) {
            return res.status(400).json({
                success: false,
                message: 'adminId and adminSecret are required'
            });
        }

        // Load network config
        const ccpPath = path.resolve(
            '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // CA setup
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName
        );

        // Wallet
        const walletPath = '/home/akshay/ProcureWatch/ProcureWatch/backend/wallet';
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if admin already exists
        const userIdentity = await wallet.get(adminId);
        if (userIdentity) {
            return res.status(409).json({
                success: false,
                message: `Identity ${adminId} already exists in wallet`
            });
        }

        // Get Org1 Admin (registrar)
        const adminIdentity = await wallet.get('org1Admin');
        if (!adminIdentity) {
            return res.status(401).json({
                success: false,
                message: 'org1Admin not found. Enroll admin first.'
            });
        }

        // Build admin user context
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'org1Admin');

        // Register new admin
        await ca.register(
            {
                enrollmentID: adminId,
                enrollmentSecret: adminSecret,
                role: 'admin',
                affiliation: 'org1.department1'
            },
            adminUser
        );

        // Enroll new admin
        const enrollment = await ca.enroll({
            enrollmentID: adminId,
            enrollmentSecret: adminSecret
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put(adminId, x509Identity);

        res.status(201).json({
            success: true,
            message: `Admin ${adminId} registered and enrolled successfully`
        });

    } catch (error) {
        console.error('Admin Registration Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/* REGISTER + ENROLL NEW DEPARTMENT (ORG1) */
router.post('/register-department', async (req, res) => {
    try {
        const { departmentId, uuid, affiliation } = req.body;

        if (!departmentId || !uuid) {
            return res.status(400).json({
                success: false,
                message: 'departmentId and uuid are required'
            });
        }

        // Load network configuration
        const ccpPath = path.resolve(
            '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // CA client
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const ca = new FabricCAServices(caInfo.url);

        // Wallet
        const walletPath = '/home/akshay/ProcureWatch/ProcureWatch/backend/wallet';
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if department already exists
        const existingIdentity = await wallet.get(departmentId);
        if (existingIdentity) {
            return res.status(409).json({
                success: false,
                message: `Department ${departmentId} already exists in wallet`
            });
        }

        // Get Org1 Admin
        const adminIdentity = await wallet.get('org1Admin');
        if (!adminIdentity) {
            return res.status(401).json({
                success: false,
                message: 'org1Admin identity not found. Enroll admin first.'
            });
        }

        // Build admin user context
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'org1Admin');

        // Register department
        const secret = await ca.register(
            {
                affiliation: affiliation || 'org1.department2',
                enrollmentID: departmentId,
                role: 'client',
                attrs: [
                    { name: 'role', value: 'department', ecert: true },
                    { name: 'uuid', value: uuid, ecert: true }
                ]
            },
            adminUser
        );

        // Enroll department
        const enrollment = await ca.enroll({
            enrollmentID: departmentId,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: 'role', optional: false },
                { name: 'uuid', optional: false }
            ]
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put(departmentId, x509Identity);

        res.status(201).json({
            success: true,
            message: `Department ${departmentId} registered and enrolled successfully`
        });

    } catch (error) {
        console.error('Department Registration Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/* REGISTER + ENROLL PROCUREMENT OFFICER */
router.post('/register-procurement-officer', async (req, res) => {
    try {
        const { officerId, uuid, affiliation } = req.body;

        if (!officerId || !uuid) {
            return res.status(400).json({
                success: false,
                message: 'officerId and uuid are required'
            });
        }

        // Load network configuration
        const ccpPath = path.resolve(
            '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // CA client
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const ca = new FabricCAServices(caInfo.url);

        // Wallet
        const walletPath = '/home/akshay/ProcureWatch/ProcureWatch/backend/wallet';
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if officer already exists
        const existingIdentity = await wallet.get(officerId);
        if (existingIdentity) {
            return res.status(409).json({
                success: false,
                message: `Procurement officer ${officerId} already exists in wallet`
            });
        }

        // Get Org1 Admin
        const adminIdentity = await wallet.get('org1Admin');
        if (!adminIdentity) {
            return res.status(401).json({
                success: false,
                message: 'org1Admin identity not found. Enroll admin first.'
            });
        }

        // Build admin context
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'org1Admin');

        // Register procurement officer
        const secret = await ca.register(
            {
                affiliation: affiliation || 'org1.department1',
                enrollmentID: officerId,
                role: 'client',
                attrs: [
                    { name: 'role', value: 'procurementOfficer', ecert: true },
                    { name: 'uuid', value: uuid, ecert: true }
                ]
            },
            adminUser
        );

        // Enroll procurement officer
        const enrollment = await ca.enroll({
            enrollmentID: officerId,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: 'role', optional: false },
                { name: 'uuid', optional: false }
            ]
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put(officerId, x509Identity);

        res.status(201).json({
            success: true,
            message: `Procurement officer ${officerId} registered and enrolled successfully`
        });

    } catch (error) {
        console.error('Procurement Officer Registration Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});



module.exports = router;
