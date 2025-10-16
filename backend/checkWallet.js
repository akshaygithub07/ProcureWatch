const { Wallets } = require('fabric-network');
const path = require('path');

async function main() {
  const walletPath = path.join(__dirname, 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const org1 = await wallet.get('adminOrg1');
  const org2 = await wallet.get('adminOrg2');

  console.log(`Org1 Identity:`, org1 ? '✅ Found' : '❌ Missing');
  console.log('Org2 Identity:', org2 ? '✅ Found' : '❌ Missing');
}

main();
