const express = require('express');
const router = express.Router();
const {
  createAccount,
  getAccountById,
  updateAccountStatus,
} = require('../queries/accounts');

router.post('/', async (req, res, next) => {
  try {
    const { customer_id, currency } = req.body;

    if (!customer_id || !currency) {
      return res.status(400).json({
        error: 'customer_id ev currency dashtery partadir e',
      });
    }

    if (!['AMD', 'USD', 'EUR'].includes(currency)) {
      return res.status(400).json({
        error: 'currency petq e liniAMD, USD kam EUR',
      });
    }

    const account = await createAccount({ customer_id, currency });
    res.status(201).json(account);

  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({
        error: 'hajaxord chka',
      });
    }
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const account = await getAccountById(req.params.id);

    if (!account) {
      return res.status(404).json({ error: 'hashiv chi gtnvel' });
    }

    res.json(account);

  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'status partadir e',
      });
    }

    if (!['active', 'frozen', 'closed'].includes(status)) {
      return res.status(400).json({
        error: 'status petq e lini active, frozen kam closed',
      });
    }

    const account = await updateAccountStatus(req.params.id, status);

    if (!account) {
      return res.status(404).json({ error: 'hashiv chi gtnvel' });
    }

    res.json(account);

  } catch (err) {
    next(err);
  }
});

module.exports = router;