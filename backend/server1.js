'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Config (edit these based on your setup)
const ccpPath = '/home/akshay/ProcureWatch/ProcureWatch/backend/connection.json'; // Your network connection profile
const contractName = 'bidding'; // Chaincode name as deployed
const channelName = 'procurementchannel'; // Fabric channel

// Path to Fabric samples crypto material
const cryptoPath = '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations'; // Update this path

// Helper: Get Contract with Direct Certificates
async function getContract(orgMSP, userId) {
    // Load network config
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create in-memory wallet
    const wallet = await Wallets.newInMemoryWallet();

    // Check if identity already exists in wallet
    const existingIdentity = await wallet.get(userId);
    if (!existingIdentity) {
        // Construct paths based on orgMSP and userId
        const orgName = orgMSP === 'Org1MSP' ? 'org1' : 'org2'; // Adjust based on your orgs
        const domain = orgMSP === 'Org1MSP' ? 'org1.example.com' : 'org2.example.com';
        
        // const certPath = path.join(
        //     cryptoPath,
        //     `peerOrganizations/${domain}/users/${userId}/msp/signcerts`
        // );
        
        // const keyPath = path.join(
        //     cryptoPath,
        //     `peerOrganizations/${domain}/users/${userId}/msp/keystore`
        // );



    //    const certPath = fs.readFileSync(path.join(
    //         cryptoPath,
    //         `peerOrganizations/${domain}/users/${userId}@${domain}/msp/signcerts`
    //     ));
        
    //     const keyPath = fs.readFileSync(path.join(
    //         cryptoPath,
    //         `peerOrganizations/${domain}/users/${userId}@${domain}/msp/keystore`
    //     ));
        // Read certificate
        // const certFiles = fs.readdirSync(certPath);
        // const certFile = certFiles.find(f => f.endsWith('.pem'));
        // if (!certFile) throw new Error(`Certificate not found in ${certPath}`);
        // const certificate = fs.readFileSync(path.join(certPath, certFile), 'utf8');
        
        const certificate = fs.readFileSync('/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem','utf8');

        // Read private key
        // const keyFiles = fs.readdirSync(keyPath);
        // const keyFile = keyFiles.find(f => f.endsWith('_sk'));
        // if (!keyFile) throw new Error(`Private key not found in ${keyPath}`);
        // const privateKey = fs.readFileSync(path.join(keyPath, keyFile), 'utf8');

         const privateKey = fs.readFileSync('/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/priv_sk', 'utf8');

        // Create identity and add to wallet
        const identity = {
            credentials: {
                certificate: certificate,
                privateKey: privateKey,
            },
            mspId: orgMSP,
            type: 'X.509',
        };

        await wallet.put(userId, identity);
        console.log(`Identity ${userId} loaded from certificates`);
    }

    // Gateway setup
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: true },
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