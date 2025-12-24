const fs = require('fs');
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

function getCCP(org) {
    const ccpPath = `/home/akshay/ProcureWatch/ProcureWatch/backend/gateway/connection-${org}.json`; // need to change the hardcoded location
    return JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
}

async function getCA(org) {
    const ccp = getCCP(org);
    const caInfo = ccp.certificateAuthorities[`ca.${org}.example.com`];
    return new FabricCAServices(caInfo.url);
}

async function getWallet(org) {
    return await Wallets.newFileSystemWallet(`wallet/${org}`);
}

module.exports = { getCCP, getCA, getWallet };
