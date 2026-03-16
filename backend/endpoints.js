const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const FabricCAServices = require('fabric-ca-client');

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
router.post('/status/:status', async (req, res) => {
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
router.post('/lowestBid/:tenderId', async (req, res) => {
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
router.post('/bidCount/:tenderId', async (req, res) => {
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

router.post('/bids/my', async (req, res) => {
    try {
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);
        const result = await contract.evaluateTransaction('getMyBids');
        const bids = JSON.parse(result.toString());

        res.json({
            success: true,
            count: bids.length,
            data: bids
        });
    } catch (error) {
        console.error('Error getting my bids:', error);

        res.status(403).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/active', async (req, res) => {
    try {
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);
        const result = await contract.evaluateTransaction('getActiveTenders');
        const tenders = JSON.parse(result.toString());

        res.json({
            success: true,
            data: tenders
        });
    } catch (error) {
        console.error('Error getting active tenders:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
router.post('/my-awarded', async (req, res) => {
    try {
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);

        const result = await contract.evaluateTransaction('getMyAwardedTenders');
        const tenders = JSON.parse(result.toString());

        res.json({
            success: true,
            data: tenders
        });
    } catch (error) {
        console.error('Error getting awarded tenders:', error);
        res.status(403).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/my-requests', async (req, res) => {
    try {
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);
        const result = await contract.evaluateTransaction('getMyProcurementRequests');
        const tenders = JSON.parse(result.toString());

        res.json({
            success: true,
            data: tenders
        });
    } catch (error) {
        console.error('Error getting procurement requests:', error);
        res.status(403).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/my-requests/bids', async (req, res) => {
    try {
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);
        const result = await contract.evaluateTransaction('getBidsOnMyRequests');
        const bids = JSON.parse(result.toString());

        res.json({
            success: true,
            data: bids
        });
    } catch (error) {
        console.error('Error getting bids on requests:', error);
        res.status(403).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/my-awarded-requests', async (req, res) => {

    try {
        const { user } = req.body;
        const { gateway, contract } = await getContract(user);
        const result = await contract.evaluateTransaction('getMyAwardedRequests');
        const tenders = JSON.parse(result.toString());

        res.json({
            success: true,
            data: tenders
        });
    } catch (error) {
        console.error('Error getting awarded requests:', error);
        res.status(403).json({
            success: false,
            error: error.message
        });
    }
});


router.post('/register-vendor', async (req, res) => {
    try {
        const { vendorId, uuid, companyName } = req.body;

        if (!vendorId || !uuid || !companyName) {
            return res.status(400).json({
                success: false,
                message: 'vendorId, uuid and companyName are required'
            });
        }

        // --------------------------------------------------
        // 1️⃣ Load Org2 Connection Profile
        // --------------------------------------------------
        const ccpPath = path.resolve(
            '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.json'
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // --------------------------------------------------
        // 2️⃣ Create CA Client
        // --------------------------------------------------
        const caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
        const ca = new FabricCAServices(caInfo.url);

        // --------------------------------------------------
        // 3️⃣ Create Wallet
        // --------------------------------------------------
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

        // --------------------------------------------------
        // 4️⃣ Get Admin Identity
        // --------------------------------------------------
        const adminIdentity = await wallet.get('org2Admin');
        if (!adminIdentity) {
            return res.status(401).json({
                success: false,
                message: 'Org2 admin not enrolled'
            });
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'org2Admin');

        // --------------------------------------------------
        // 5️⃣ Register Vendor (IDENTITY ONLY)
        // --------------------------------------------------
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

        // --------------------------------------------------
        // 6️⃣ Enroll Vendor
        // --------------------------------------------------
        const enrollment = await ca.enroll({
            enrollmentID: vendorId,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: 'role', optional: false },
                { name: 'uuid', optional: false }
            ]
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: 'Org2MSP',
            type: 'X.509'
        };

        await wallet.put(vendorId, x509Identity);

        // --------------------------------------------------
        // 7️⃣ Connect to Fabric Network
        // --------------------------------------------------
        const gateway = new Gateway();

        await gateway.connect(ccp, {
            wallet,
            identity: 'org2Admin',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('bidding'); // <-- your chaincode name

        // --------------------------------------------------
        // 8️⃣ Store Business Data On Ledger
        // --------------------------------------------------
        await contract.submitTransaction(
            'registerVendorOnLedger',
            vendorId,
            companyName,
            uuid
        );

        await gateway.disconnect();

        return res.status(201).json({
            success: true,
            message: 'Vendor registered successfully',
            vendorId,
            companyName
        });

    } catch (error) {
        console.error('Vendor registration failed:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


router.post('/register-officer', async (req, res) => {
    try {
        const {
            officerId,
            uuid,
            role,
            organizationId,
            departmentId,
            firstName,
            lastName,
            email
        } = req.body;

        if (!officerId || !uuid || !role || !organizationId || !departmentId || !firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!['procurementOfficer', 'deliveryOfficer'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const ccpPath = path.resolve(
            '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
        );

        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const ca = new FabricCAServices(caInfo.url);

        const walletPath = '/home/akshay/ProcureWatch/ProcureWatch/backend/wallet';
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const existingIdentity = await wallet.get(officerId);
        if (existingIdentity) {
            return res.status(409).json({
                success: false,
                message: `Officer ${officerId} already exists`
            });
        }

        const adminIdentity = await wallet.get('org1Admin');
        if (!adminIdentity) {
            return res.status(401).json({
                success: false,
                message: 'org1Admin not found'
            });
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'org1Admin');

        // Register officer in CA
        const secret = await ca.register(
            {
                affiliation: 'org1.department1',
                enrollmentID: officerId,
                role: 'client',
                attrs: [
                    { name: 'role', value: role, ecert: true },
                    { name: 'uuid', value: uuid, ecert: true },
                    { name: 'organizationId', value: organizationId, ecert: true },
                    { name: 'departmentId', value: departmentId, ecert: true }
                ]
            },
            adminUser
        );

        const enrollment = await ca.enroll({
            enrollmentID: officerId,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: 'role', optional: false },
                { name: 'uuid', optional: false },
                { name: 'organizationId', optional: false },
                { name: 'departmentId', optional: false }
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

        /* ---------- NEW PART: WRITE OFFICER DATA TO LEDGER ---------- */

        const gateway = new Gateway();

        await gateway.connect(ccp, {
            wallet,
            identity: 'org1Admin',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('procurementchannel');
        const contract = network.getContract('procurement');

        await contract.submitTransaction(
            'registerOfficerOnLedger',
            officerId,
            firstName,
            lastName,
            email,
            organizationId,
            departmentId,
            role,
            uuid
        );

        await gateway.disconnect();

        /* ------------------------------------------------------------ */

        res.status(201).json({
            success: true,
            message: `${role} registered and stored on ledger successfully`
        });

    } catch (error) {
        console.error('Officer Registration Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


module.exports = router;
