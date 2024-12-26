const sequelize = require('./db');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Есть коннект.');
    } catch (error) {
        console.error('Нет коннекта:', error);
    }
}

testConnection();
