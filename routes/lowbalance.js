const express = require('express');

const router = express.Router();

const lowBalance = require('../controllers/lowbalance');

// uptime robot check
router.get('/check_low_balance', lowBalance.checkLowBalance);
router.get('/get_low_balance_list', lowBalance.getLowBalanceList);

module.exports = router;
