const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.User = require('./User')(sequelize, DataTypes);
db.Recipe = require('./Recipe')(sequelize, DataTypes);

module.exports = db;