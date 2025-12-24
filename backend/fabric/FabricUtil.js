const { getCA, getWallet, getCCP } = require('./CAUtil');
const { Wallets } = require('fabric-network');

//enroll Admin
async function enrollAdmin(org) {
    const ca = await getCA(org);
    const wallet = await getWallet(org);

    const identity = await wallet.get(`${org}Admin`);
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
            privateKey: enrollment.key.toBytes(),
        },
        mspId: `${org}MSP`,
        type: 'X.509',
    };

    await wallet.put('admin', x509Identity);
    console.log(`Successfully enrolled admin for ${org}`);
}

/// REGISTER USER
async function registerUser(org, username, affiliation, role) {
    const ca = await getCA(org);
    const wallet = await getWallet(org);

    const adminIdentity = await wallet.get(`${org}Admin`);
    if (!adminIdentity) throw new Error("Admin identity missing");

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, `${org}admin`);

    // Register with Fabric CA + role attribute
    const secret = await ca.register({
        enrollmentID: username,
        affiliation: affiliation,
        role: 'client',
        attrs: [
            { name: "role", value: role, ecert: true }
        ]
    }, adminUser);

    return secret;
}


/// ENROLL USER
async function enrollUser(org, username, password) {
    const ca = await getCA(org);
    const wallet = await getWallet(org);

    const enrollment = await ca.enroll({
        enrollmentID: username,
        enrollmentSecret: password
    });

    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: `${org}MSP`,
        type: 'X.509',
    };

    await wallet.put(username, x509Identity);
}

module.exports = { registerUser, enrollUser,enrollAdmin };
