require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main(){
    await client.connect();
    const result = await client.query('SELECT * FROM products');
    console.log(result.rows);
    await client.end();
}

main();