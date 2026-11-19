require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    const result = await pool.query('SELECT * FROM products');
    console.log(result.rows);
}

main();