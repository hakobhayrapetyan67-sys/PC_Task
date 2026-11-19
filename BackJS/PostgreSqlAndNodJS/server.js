// naive version
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL error', err.message);
    
});
const app = express();

app.get('/products', async (req, res, next) => {
    try{
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch(err) {
        next(err);
    }
});

async function start () {
    try{
        await pool.query('SELECT 1');
        console.log('Connected to PostgreSQL');
    } catch (err){}
}

app.get('/products', async (req, res) => {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
});

app.listen(process.env.PORT, () => {
    console.log('Server is runing');
})