const pool = require('../db/db');

async function createCustomer({ full_name, email, phone }) {
  const { rows } = await pool.query(
    `INSERT INTO customers (full_name, email, phone)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [full_name, email, phone]
  );
  return rows[0];
}

async function getCustomerById(id) {
  const customerResult = await pool.query(
    `SELECT * FROM customers WHERE id = $1`,
    [id]
  );

  if (customerResult.rows.length === 0) {
    return null;
  }

  const accountResult = await pool.query(
    `SELECT * FROM accounts WHERE customer_id = $1`,
    [id]
  );

  return {
    ...customerResult.rows[0],
    accounts: accountResult.rows,
  };
}

module.exports = {
  createCustomer,
  getCustomerById,
};