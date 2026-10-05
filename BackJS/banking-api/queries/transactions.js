const pool = require('../db/db');

async function deposit({ account_id, amount, reference, note }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const accResult = await client.query(
      `SELECT * FROM accounts WHERE id = $1 FOR UPDATE`,
      [account_id]
    );

    if (accResult.rows.length === 0) {
      throw new Error('NOT_FOUND');
    }

    const account = accResult.rows[0];

    if (account.status !== 'active') {
      throw new Error('NOT_ACTIVE');
    }

    const newBalance = BigInt(account.balance) + BigInt(amount);
    await client.query(
      `UPDATE accounts SET balance = $1 WHERE id = $2`,
      [newBalance.toString(), account_id]
    );

    const txResult = await client.query(
      `INSERT INTO transactions (type, to_account_id, amount, reference, note)
       VALUES ('deposit', $1, $2, $3, $4)
       RETURNING *`,
      [account_id, amount, reference, note]
    );

    await client.query(
      `INSERT INTO audit_logs (action, meta)
       VALUES ('deposit', $1)`,
      [JSON.stringify({ account_id, amount, reference })]
    );

    await client.query('COMMIT');
    return txResult.rows[0];

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function withdraw({ account_id, amount, reference, note }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const accResult = await client.query(
      `SELECT * FROM accounts WHERE id = $1 FOR UPDATE`,
      [account_id]
    );

    if (accResult.rows.length === 0) {
      throw new Error('NOT_FOUND');
    }

    const account = accResult.rows[0];

    if (account.status !== 'active') {
      throw new Error('NOT_ACTIVE');
    }

    if (BigInt(account.balance) < BigInt(amount)) {
      throw new Error('INSUFFICIENT_FUNDS');
    }

    const newBalance = BigInt(account.balance) - BigInt(amount);
    await client.query(
      `UPDATE accounts SET balance = $1 WHERE id = $2`,
      [newBalance.toString(), account_id]
    );

    const txResult = await client.query(
      `INSERT INTO transactions (type, from_account_id, amount, reference, note)
       VALUES ('withdraw', $1, $2, $3, $4)
       RETURNING *`,
      [account_id, amount, reference, note]
    );

    await client.query(
      `INSERT INTO audit_logs (action, meta)
       VALUES ('withdraw', $1)`,
      [JSON.stringify({ account_id, amount, reference })]
    );

    await client.query('COMMIT');
    return txResult.rows[0];

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function transfer({ from_account_id, to_account_id, amount, reference, note }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const [first, second] = [from_account_id, to_account_id].sort((a, b) => a - b);

    await client.query(
      `SELECT * FROM accounts WHERE id = $1 FOR UPDATE`,
      [first]
    );
    await client.query(
      `SELECT * FROM accounts WHERE id = $1 FOR UPDATE`,
      [second]
    );

    const accountsResult = await client.query(
      `SELECT * FROM accounts WHERE id IN ($1, $2)`,
      [from_account_id, to_account_id]
    );

    if (accountsResult.rows.length !== 2) {
      throw new Error('NOT_FOUND');
    }

    const fromAccount = accountsResult.rows.find(a => a.id === from_account_id);
    const toAccount = accountsResult.rows.find(a => a.id === to_account_id);

    if (fromAccount.status !== 'active') throw new Error('FROM_NOT_ACTIVE');
    if (toAccount.status !== 'active') throw new Error('TO_NOT_ACTIVE');

    if (BigInt(fromAccount.balance) < BigInt(amount)) {
      throw new Error('INSUFFICIENT_FUNDS');
    }

    await client.query(
      `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
      [amount, from_account_id]
    );
    await client.query(
      `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
      [amount, to_account_id]
    );

    const txResult = await client.query(
      `INSERT INTO transactions (type, from_account_id, to_account_id, amount, reference, note)
       VALUES ('transfer', $1, $2, $3, $4, $5)
       RETURNING *`,
      [from_account_id, to_account_id, amount, reference, note]
    );

    await client.query(
      `INSERT INTO audit_logs (action, meta)
       VALUES ('transfer', $1)`,
      [JSON.stringify({ from: from_account_id, to: to_account_id, amount, reference })]
    );

    await client.query('COMMIT');
    return txResult.rows[0];

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  deposit,
  withdraw,
  transfer,
};