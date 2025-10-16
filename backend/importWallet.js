// importWallet.js
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // === ORG1 ===
    const org1CertPath = path.resolve(__dirname, '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem');
    const org1KeyDir = path.resolve(__dirname, '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore');
    const org1KeyFile = fs.readdirSync(org1KeyDir)[0];
    const org1KeyPath = path.join(org1KeyDir, org1KeyFile);

    const org1Cert = fs.readFileSync(org1CertPath, 'utf8');
    const org1Key = fs.readFileSync(org1KeyPath, 'utf8');

    await wallet.put('adminOrg1', {
        credentials: {
            certificate: org1Cert,
            privateKey: org1Key,
        },
        mspId: 'Org1MSP',
        type: 'X.509'
    });

    console.log('✅ Org1 admin imported');

    // === ORG2 ===
    const org2CertPath = path.resolve(__dirname, '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/signcerts/Admin@org2.example.com-cert.pem');
    const org2KeyDir = path.resolve(__dirname, '/home/akshay/ProcureWatch/ProcureWatch/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore');
    const org2KeyFile = fs.readdirSync(org2KeyDir)[0];
    const org2KeyPath = path.join(org2KeyDir, org2KeyFile);

    const org2Cert = fs.readFileSync(org2CertPath, 'utf8');
    const org2Key = fs.readFileSync(org2KeyPath, 'utf8');

    await wallet.put('adminOrg2', {
        credentials: {
            certificate: org2Cert,
            privateKey: org2Key,
        },
        mspId: 'Org2MSP',
        type: 'X.509'
    });

    console.log('✅ Org2 admin imported');
}

main();
