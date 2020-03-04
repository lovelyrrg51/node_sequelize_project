const express = require('express');

const router = express.Router();

const maingrid_popup = require('../controllers/maingrid_popup');

// uptime robot check
router.get('/get_maingrid_edit_menu_info', maingrid_popup.getMaingridEditMenuInfo);
router.get('/get_maingrid_edit_menu_traffic_limit', maingrid_popup.getMaingridEditMenuTrafficLimit);
router.post('/set_maingrid_edit_menu_info', maingrid_popup.setMaingridEditMenuInfo);
router.get('/get_maingrid_data_usage_menu_month', maingrid_popup.getMaingridDataUsageMenuMonth);
router.get('/get_maingrid_data_usage_menu_day', maingrid_popup.getMaingridDataUsageMenuDay);
router.get('/get_maingrid_events_menu_list', maingrid_popup.getMaingridEventsMenuList);
router.post('/set_simcard_suspend', maingrid_popup.setSimcardSuspend);
router.post('/set_simcard_activate', maingrid_popup.setSimcardActivate);
router.get('/reset_simcard_connection', maingrid_popup.resetSimcardConnection);
router.get('/get_countries_list', maingrid_popup.getCountriesList);
router.get('/get_operators_list', maingrid_popup.getOperatorsList);
router.post('/set_maingrid_blacklist_operators', maingrid_popup.setMaingridBlacklistOperators);
router.get('/get_maingrid_blacklist_operators', maingrid_popup.getMaingridBlacklistOperators);
router.post('/remove_maingrid_blacklist_operator', maingrid_popup.removeMaingridBlacklistOperator);

module.exports = router;
