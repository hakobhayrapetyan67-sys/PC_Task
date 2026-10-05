const express = require('express');
const router = express.Router();
const { deposit, withdraw, transfer } = require('../queries/transactions');

// POST /accounts/:id/deposit
router.post('/accounts/:id/deposit', async (req, res, next) => {
  try {
    const { amount, reference, note } = req.body;
    const account_id = parseInt(req.params.id);

    if (!amount || !reference) {
      return res.status(400).json({ error: 'amount ev reference partadir en' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'amount petq e lini drakan' });
    }

    const result = await deposit({ account_id, amount, reference, note });
    res.status(201).json(result);

  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Hashiv chi gtnvel' });
    }
    if (err.message === 'NOT_ACTIVE') {
      return res.status(400).json({ error: 'Hashivy active che' });
    }
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Reference arden ka' });
    }
    next(err);
  }
});

// POST /accounts/:id/withdraw
router.post('/accounts/:id/withdraw', async (req, res, next) => {
  try {
    const { amount, reference, note } = req.body;
    const account_id = parseInt(req.params.id);

    if (!amount || !reference) {
      return res.status(400).json({ error: 'amount ev reference partadir en' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'amount petq e lini drakan' });
    }

    const result = await withdraw({ account_id, amount, reference, note });
    res.status(201).json(result);

  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Hashiv chi gtnvel' });
    }
    if (err.message === 'NOT_ACTIVE') {
      return res.status(400).json({ error: 'Hashivy active che' });
    }
    if (err.message === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({ error: 'Balance-y bavarar che' });
    }
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Reference arden ka' });
    }
    next(err);
  }
});

// POST /transfers
router.post('/transfers', async (req, res, next) => {
  try {
    const { fromAccountId, toAccountId, amount, reference, note } = req.body;

    if (!fromAccountId || !toAccountId || !amount || !reference) {
      return res.status(400).json({
        error: 'fromAccountId, toAccountId, amount ev reference partadir en',
      });
    }

    if (fromAccountId === toAccountId) {
      return res.status(400).json({ error: 'Hashivnery petq e tarber linen' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'amount petq e lini drakan' });
    }

    const result = await transfer({
      from_account_id: fromAccountId,
      to_account_id: toAccountId,
      amount,
      reference,
      note,
    });
    res.status(201).json(result);

  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Hashiv chi gtnvel' });
    }
    if (err.message === 'FROM_NOT_ACTIVE' || err.message === 'TO_NOT_ACTIVE') {
      return res.status(400).json({ error: 'Hashivnery active chen' });
    }
    if (err.message === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({ error: 'Balance-y bavarar che' });
    }
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Reference arden ka' });
    }
    next(err);
  }
});

module.exports = router;