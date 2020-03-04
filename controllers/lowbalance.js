const models = require('../models');
const uuidV4 = require('uuid/v4');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config');
const passport = require('passport');
const { sendEmailTemplate, errorResponse, reducedErrorMessage } = require('../modules/utils');
//const sequelize = require('sequelize');
const db = require('../models');

exports.checkLowBalance =  async(req, res, next) => {
  passport.authenticate('local-jwt', (err, user, info) => {
    if(err) { return next(err); }
    if (!user) { return errorResponse(err, 'Invalid E-mail'); }

    if (!user.tborganisation.payment_type)
        return res.status(httpStatus.OK).json({ status: '0'});

    db.sequelize.query(`SELECT (GetWalletBalance(${user.organisationid}) - GetSumSIMCardsCost(${user.organisationid})) < 0`, { type: db.sequelize.QueryTypes.SELECT}).then (result =>{
      if (!result[0][`(GetWalletBalance(${user.organisationid}) - GetSumSIMCardsCost(${user.organisationid})) < 0`])
        return res.status(httpStatus.OK).json({ status: '0'});            
    });

    return res.status(httpStatus.OK).json({ status: '1'});
  })(req, res, next);
}


exports.getLowBalanceList =  async(req, res, next) => {
  passport.authenticate('local-jwt', (err, user, info) => {
    if(err) { return next(err); }
    if (!user) { return errorResponse(err, 'Invalid E-mail'); }

    models.tbwallet.findAll({
      where:{
        organisationID: user.organisationid
      },
      order:[
        ['time_stamp', 'DESC']
      ],
      attributes:['transactionID', 'time_stamp', 'description', 'amount']
    }).then(wallets => {
     return res.status(httpStatus.OK).json(wallets);
    });
  })(req, res, next);
}

