'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Config (edit these based on your setup)
const ccpPath = path.resolve(__dirname, 'connection.json'); // Your network connection profile
const contractName = 'bidding'; // Chaincode name as deployed
const channelName = 'mychannel'; // Fabric channel

// Helper: Get Contract
async function getContract(orgMSP, userId) {
    // Load network config
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Wallet setup: here we expect user credentials to be present in the 'wallet' folder
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check user identity
    const identity = await wallet.get(userId);
    if (!identity) throw new Error(`Identity for user ${userId} not found in wallet`);

    // Gateway setup
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: true }
    });

    // Get network and contract
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(contractName);

    return { contract, gateway };
}

// Middleware to extract org and user from headers
function requireIdentity(req, res, next) {
    req.orgMSP = req.header('X-Org-MSP');
    req.userId = req.header('X-User-Id');
    if (!req.orgMSP || !req.userId) {
        return res.status(400).json({ error: 'Missing X-Org-MSP or X-User-Id headers' });
    }
    next();
}

// --- API Endpoints ---

// Create tender (Buyer only)
app.post('/tenders', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgMSP, req.userId);
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

// Submit bid (Supplier only)
app.post('/tenders/:tenderId/bids', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgMSP, req.userId);
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

// Award tender (Buyer only)
app.post('/tenders/:tenderId/award', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgMSP, req.userId);
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

// Cancel tender (Buyer only)
app.post('/tenders/:tenderId/cancel', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgMSP, req.userId);
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

// Read tender (Anyone)
app.get('/tenders/:tenderId', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgMSP, req.userId);
        const tenderId = req.params.tenderId;
        const result = await contract.evaluateTransaction('readTender', tenderId);
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// List tenders by status (role-based filtering as per contract logic)
app.get('/tenders', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgMSP, req.userId);
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

// Get tender history (Auditor or Buyer)
app.get('/tenders/:tenderId/history', requireIdentity, async (req, res) => {
    try {
        const { contract, gateway } = await getContract(req.orgMSP, req.userId);
        const tenderId = req.params.tenderId;
        const result = await contract.evaluateTransaction('getTenderHistory', tenderId);
        await gateway.disconnect();
        res.json(JSON.parse(result.toString()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Start Server
app.listen(3000, () => {
    console.log('Express server started on port 3000');
});
