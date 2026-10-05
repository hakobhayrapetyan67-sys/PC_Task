const express = require('express');
const router = express.Router();
const { createCustomer, getCustomerById } = require('../queries/customers');

router.post('/', async (req, res, next) => {
  try {
    const { full_name, email, phone } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({ 
        error: 'full_name  email partadir en' 
      });
    }

    const customer = await createCustomer({ full_name, email, phone });
    res.status(201).json(customer);

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ 
        error: 'email_ov hajaxord ka arten' 
      });
    }
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const customer = await getCustomerById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'hajaxordn chi gtnvel' });
    }

    res.json(customer);

  } catch (err) {
    next(err);
  }
});

module.exports = router;