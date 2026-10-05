require('dotenv').config();
const express = require('express');
const pool = require('./db/db');
const customersRouter = require('./routes/customers');
const accountsRouter = require('./routes/accounts');
const transactionsRouter = require('./routes/transactions');

const app = express();

app.use(express.json());

app.use('/api/customers', customersRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api', transactionsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'server is runing' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'chka uxin' });
});

app.use((err, req, res, next) => {
  console.error('sxal', err.message);
  res.status(500).json({ error: 'nerqin serveri sxal' });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('miacel e PostgreSQL-in');

    app.listen(PORT, () => {
      console.log(`servern ashxatum e http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('sxal', err.message);
    process.exit(1);
  }
}

start();