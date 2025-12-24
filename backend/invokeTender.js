const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        // 1. Load connection profile
        const ccpPath = path.resolve(
            __dirname,
            '../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // 2. Create wallet
        const walletPath = '/home/akshay/ProcureWatch/ProcureWatch/backend/wallet'
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // 3. Check if user exists
        const identity = await wallet.get('ProcurementOfficer-Rama02');
        if (!identity) {
            console.error('AppUser not found in wallet');
            return;
        }

        // 4. Connect gateway
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'ProcurementOfficer-Rama02',
            discovery: { enabled: true, asLocalhost: true }
        });

        // 5. Get network + contract
        const network = await gateway.getNetwork('procurementchannel');
        const contract = network.getContract('procurement');

        // 6. Submit transaction (matches peer invoke)
        const result = await contract.submitTransaction(
            "createTender",
            "T002",
            "Laptop purchase 100 units",
            "70000",
            "95000",
            "2025-11-31"
        );

        console.log("Tender created successfully!");
        console.log(result.toString());

        // 7. Disconnect
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
