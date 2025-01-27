const {Sequelize} = require('sequelize');

const sequelize = new Sequelize("nym","postgres","0000",{
    host: "localhost",
    dialect: "postgres",
});

module.exports = sequelize;