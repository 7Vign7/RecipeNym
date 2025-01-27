const sequelize = require('./config/db');

async function test() {
    try{
    await sequelize.authenticate()
        console.log("super");
    }
    catch(e) {
        console.error(e);
    }
    finally {
        await sequelize.close()
    }
}

test();