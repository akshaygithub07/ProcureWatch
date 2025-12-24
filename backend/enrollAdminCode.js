const { getCA, getWallet, getCCP } = require('../backend/fabric/CAUtil');
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');

async function enrollAdmin(org) {
    const ca = await getCA(org);
    const wallet = await getWallet(org);

    const identity = await wallet.get('admin');
    if (identity) {
        console.log(`Admin identity already exists for ${org}`);
        return;
    }

    const enrollment = await ca.enroll({
        enrollmentID: 'admin',
        enrollmentSecret: 'adminpw'
    });

    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toPrivateKeyPEM(),
        },
        mspId: `${org}MSP`,
        type: 'X.509',
    };

    await wallet.put('admin', x509Identity);
    console.log(`Successfully enrolled admin for ${org}`);
}

module.exports = { enrollAdmin };
