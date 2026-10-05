// test-db.js
const pool = require('./db/db');

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('kapy hajoxvec');

    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Axyusaky bazaium');
    tables.rows.forEach(row => console.log('-', row.table_name));
    
  } catch (err) {
    console.error('sxal', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();