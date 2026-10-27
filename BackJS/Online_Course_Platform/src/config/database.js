const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const {
    DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_DIALECT
} = require('./env');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: false
});

const ensureDatabaseExists = async () => {
    const connection = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD
    });

    await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`
    );
    await connection.end();
};

module.exports = { sequelize, ensureDatabaseExists };
