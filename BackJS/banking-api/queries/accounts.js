const pool = require('../db/db');


async function createAccount({customer_id, currency}){
    const { rows } = await pool.query(
        `INSERT INTO accounts (customer_id, currency, status)
        VALUES ($1, $2, 'active')
        RETURNING * `,
        [customer_id, currency]
    );
    return rows[0];
}

async function getAccountById(id) {
    const { rows } = await pool.query(
        `SELECT * FROM accounts WHERE id = $1`,
        [id]
    );
    return rows[0] || null;
}

async function updateAccountStatus(id, status){
    const { rows } = await pool.query(
        `UPDATE accounts
        SET status = $1
        WHERE id = $2
        RETURNING *`,
        [status, id]
    );
    return rows[0] || null;
}
module.exports = {
    createAccount,
    getAccountById,
    updateAccountStatus,
}