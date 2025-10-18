'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// ---------------- CONFIG ----------------
const ccpPath = '/home/akshay/ProcureWatch/ProcureWatch/backend/connection.json'; // Fabric CA-based connection profile
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

const channelName = 'procurementchannel';
const contractName = 'procurement';

// Where wallet files are stored
const walletPath ='/home/akshay/ProcureWatch/ProcureWatch/backend/wallet';

// ---------------- UTILITIES ----------------

// Get or create wallet
async function getWallet() {
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    return wallet;
}

// Enroll Org Admin (if not already enrolled)
async function enrollAdmin(orgName) {
    const wallet = await getWallet();

    const orgInfo = ccp.organizations[orgName];
    const orgCAName = orgInfo.certificateAuthorities[0];
    const caInfo = ccp.certificateAuthorities[orgCAName];
    const ca = new FabricCAServices(caInfo.url);

    const adminIdentityLabel = `${orgName}-admin`;

    const existing = await wallet.get(adminIdentityLabel);
    if (existing) {
        console.log(`Admin already enrolled for ${orgName}`);
        return;
    }

    const enrollment = await ca.enroll({
        enrollmentID: caInfo.registrar[0].enrollId,
        enrollmentSecret: caInfo.registrar[0].enrollSecret
    });

    const identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes()
        },
        mspId: orgInfo.mspid,
        type: 'X.509'
    };

    await wallet.put(adminIdentityLabel, identity);
    console.log(`✅ Enrolled admin for ${orgName}`);
}

// Register + enroll user (if not already enrolled)
async function registerAndEnrollUser(orgName, userId, affiliation) {
    const wallet = await getWallet();
    const orgInfo = ccp.organizations[orgName];
    const orgCAName = orgInfo.certificateAuthorities[0];
    const caInfo = ccp.certificateAuthorities[orgCAName];
    const ca = new FabricCAServices(caInfo.url);

    const adminLabel = `${orgName}-admin`;
    const adminIdentity = await wallet.get(adminLabel);
    if (!adminIdentity) {
        throw new Error(`Admin identity not found for ${orgName}. Enroll admin first.`);
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminLabel);

    const userExists = await wallet.get(userId);
    if (userExists) {
        console.log(`User ${userId} already enrolled`);
        return; // already enrolled
    }

    let secret;
    try {
        // Attempt to register the user
        secret = await ca.register({
            affiliation: affiliation || '',
            enrollmentID: userId,
            role: 'client'
        }, adminUser);
    } catch (error) {
        if (error.toString().includes('already registered')) {
            console.log(`User ${userId} is already registered, skipping registration`);
            // Use a default secret (must match what was used during first registration)
            secret = 'adminpw'; // or whatever you originally registered
        } else {
            throw error;
        }
    }

    const enrollment = await ca.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret
    });

    const userIdentity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes()
        },
        mspId: orgInfo.mspid,
        type: 'X.509'
    };

    await wallet.put(userId, userIdentity);
    console.log(`✅ Registered and enrolled user: ${userId} (${orgName})`);
}


// Helper: get Contract using Fabric CA wallet
async function getContract(orgName, userId) {
    const wallet = await getWallet();
    const identity = await wallet.get(userId);

    if (!identity) {
        // auto register/enroll user if missing
        await registerAndEnrollUser(orgName, userId, `${orgName.toLowerCase()}.department1`);
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(contractName);

    return { contract, gateway };
}

// Middleware to extract org + user headers
function requireIdentity(req, res, next) {
    req.orgName = req.header('X-Org-Name');
    req.userId = req.header('X-User-Id');
    if (!req.orgName || !req.userId) {
        return res.status(400).json({ error: 'Missing X-Org-Name or X-User-Id headers' });
    }
    next();
}

// ---------------- API ENDPOINTS ----------------

// Create tender
app.post('/tenders', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgName, req.userId);
        const { tenderId, description, minAmount, maxAmount, deadline } = req.body;
        const result = await contract.submitTransaction(
            'createTender', tenderId, description, String(minAmount), String(maxAmount), deadline || ''
        );
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Submit bid
app.post('/tenders/:tenderId/bids', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgName, req.userId);
        const { amount, proposal } = req.body;
        const tenderId = req.params.tenderId;
        const result = await contract.submitTransaction(
            'submitBid', tenderId, String(amount), proposal || ''
        );
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Award tender
app.post('/tenders/:tenderId/award', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgName, req.userId);
        const { supplier } = req.body;
        const tenderId = req.params.tenderId;
        const result = await contract.submitTransaction(
            'awardTender', tenderId, supplier
        );
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Cancel tender
app.post('/tenders/:tenderId/cancel', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgName, req.userId);
        const { reason } = req.body;
        const tenderId = req.params.tenderId;
        const result = await contract.submitTransaction(
            'cancelTender', tenderId, reason || ''
        );
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Read tender
app.get('/tenders/:tenderId', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgName, req.userId);
        // const { contract} = await getContract(req.orgName); //need to change later
        const tenderId = req.params.tenderId;
        const result = await contract.evaluateTransaction('readTender', tenderId);
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// List tenders
app.get('/tenders', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgName, req.userId);
        const { status } = req.query;
        let result;
        if (status) {
            result = await contract.evaluateTransaction('getTendersByStatus', status);
        } else {
            result = await contract.evaluateTransaction('getAllTenders');
        }
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Tender history
app.get('/tenders/:tenderId/history', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgName, req.userId);
        const tenderId = req.params.tenderId;
        const result = await contract.evaluateTransaction('getTenderHistory', tenderId);
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ---------------- START SERVER ----------------
app.listen(3000, async () => {
    console.log('✅ Express server started on port 3000');
    // optional: pre-enroll admins
    for (const orgName of Object.keys(ccp.organizations)) {
        await enrollAdmin(orgName);
    }
});
