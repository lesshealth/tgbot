const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tgbotdb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;
