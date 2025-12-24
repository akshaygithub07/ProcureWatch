const { enrollAdmin } = require('./enrollAdminCode');

async function main() {
    try {
        await enrollAdmin("org1");
        await enrollAdmin("org2");
        await enrollAdmin("org3"); // if multiple orgs
    } catch (err) {
        console.error(err);
    }
}

main();
