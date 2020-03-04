const express = require('express');

const router = express.Router();

const system = require('../controllers/system');

// uptime robot check
router.post('/set_user_setting', system.setUserSetting);
router.get('/get_organisation_setting', system.getOrganisationSetting);
router.get('/get_orders_setting', system.getOrdersSetting);
router.get('/get_place_order_setting', system.getPlaceOrderSetting);
router.post('/save_new_order_setting', system.saveNewOrderSetting);
router.get('/get_current_month_summary_setting', system.getCurrentMonthSummarySetting);
router.get('/get_billing_list_setting', system.getBillingListSetting);
router.get('/get_billing_detail_list_setting', system.getBillingDetailListSetting);
router.get('/get_user_logs_setting', system.getUserLogsSetting);
router.get('/get_log_user_list_setting', system.getLogUserListSetting);

module.exports = router;
