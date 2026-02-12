const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const router = express.Router();

/* FABRIC CONNECTION HELPER */
async function getContract(identityName) {
    const ccpPath = path.resolve(
        __dirname,
        '../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = '/home/akshay/ProcureWatch/ProcureWatch/backend/wallet';
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get(identityName);
    if (!identity) {
        throw new Error(`Identity ${identityName} not found in wallet`);
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: identityName,
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('procurementchannel');
    const contract = network.getContract('procurement');

    return { gateway, contract };
}

/* CREATE TENDER (BUYER) */
router.post('/create', async (req, res) => {
    try {
        const { tenderId, description, minAmount, maxAmount, deadline, user } = req.body;

        const { gateway, contract } = await getContract(user);

        const result = await contract.submitTransaction(
            'createTender',
            tenderId,
            description,
            minAmount,
            maxAmount,
            deadline
        );

        await gateway.disconnect();

        res.status(201).json({
            success: true,
            message: 'Tender created',
            data: JSON.parse(result.toString())
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/* SUBMIT BID (SUPPLIER) */
router.post('/bid', async (req, res) => {
    try {
        const { tenderId, amount, proposal, user } = req.body;

        const { gateway, contract } = await getContract(user);

        const result = await contract.submitTransaction(
            'submitBid',
            tenderId,
            amount,
            proposal
        );

        await gateway.disconnect();

        res.json({
            success: true,
            message: 'Bid submitted',
            data: JSON.parse(result.toString())
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/* AWARD TENDER (BUYER) */
router.post('/award', async (req, res) => {
    try {
        const { tenderId, supplier, user } = req.body;

        const { gateway, contract } = await getContract(user);

        const result = await contract.submitTransaction(
            'awardTender',
            tenderId,
            supplier
        );

        await gateway.disconnect();

        res.json({
            success: true,
            message: 'Tender awarded',
            data: JSON.parse(result.toString())
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/*  CANCEL TENDER (BUYER) */
router.post('/cancel', async (req, res) => {
    try {
        const { tenderId, reason, user } = req.body;

        const { gateway, contract } = await getContract(user);

        const result = await contract.submitTransaction(
            'cancelTender',
            tenderId,
            reason
        );

        await gateway.disconnect();

        res.json({
            success: true,
            message: 'Tender cancelled',
            data: JSON.parse(result.toString())
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/* READ SINGLE TENDER */
router.get('/:tenderId', async (req, res) => {
    try {
        const { tenderId } = req.params;
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);

        const result = await contract.evaluateTransaction(
            'readTender',
            tenderId
        );

        await gateway.disconnect();

        res.json({
            success: true,
            data: JSON.parse(result.toString())
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/* GET ALL TENDERS */
router.post('/', async (req, res) => {
    try {
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);

        const result = await contract.evaluateTransaction('getAllTenders');

        await gateway.disconnect();

        res.json({
            success: true,
            data: JSON.parse(result.toString())
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/* GET TENDERS BY STATUS */
router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);

        const result = await contract.evaluateTransaction(
            'getTendersByStatus',
            status
        );

        await gateway.disconnect();

        res.json({
            success: true,
            data: JSON.parse(result.toString())
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/* TENDER HISTORY (AUDITOR) */
router.get('/history/:tenderId', async (req, res) => {
    try {
        const { tenderId } = req.params;
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);

        const result = await contract.evaluateTransaction(
            'getTenderHistory',
            tenderId
        );

        await gateway.disconnect();

        res.json({
            success: true,
            data: JSON.parse(result.toString())
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/*LOWEST BID (BUYER/AUDITOR)*/
router.get('/lowestBid/:tenderId', async (req, res) => {
    try {
        const { tenderId } = req.params;
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);

        const result = await contract.evaluateTransaction(
            'getLowestBid',
            tenderId
        );

        await gateway.disconnect();

        res.json({
            success: true,
            data: JSON.parse(result.toString())
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/* BID COUNT */
router.get('/bidCount/:tenderId', async (req, res) => {
    try {
        const { tenderId } = req.params;
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);

        const result = await contract.evaluateTransaction(
            'getBidsCount',
            tenderId
        );

        await gateway.disconnect();

        res.json({
            success: true,
            count: result.toString()
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
