const express = require('express');

const router = express.Router();

const maingrid = require('../controllers/maingrid');

// uptime robot check
router.get('/get_maingrid_list', maingrid.getMaingridList);
router.post('/set_email_lock_status', maingrid.setEmailLockStatus);
router.get('/get_connections_summary', maingrid.getConnectionsSummary);
router.get('/get_plan_list', maingrid.getPlanList);
router.get('/get_country_filter_list', maingrid.getCountryFilterList);
router.get('/get_operator_filter_list', maingrid.getOperatorFilterList);

module.exports = router;
