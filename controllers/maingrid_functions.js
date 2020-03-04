const models = require('../models');
const httpStatus = require('http-status');
const config = require('../config');
const sequelize = require('sequelize');
const db = require('../models');

const {sendEmailTemplate, reducedErrorMessage, errorResponse } = require('../modules/utils');

exports.GetAlertType = async(simcardid) => {
  const result = await db.sequelize.query(`SELECT GetAlertType(${simcardid})`, { type: db.sequelize.QueryTypes.SELECT});
  const total_value = result[0][`GetAlertType(${simcardid})`];
        
  return total_value;
}

exports.GetNumBlackListedOperators = async(endpointid) => {
  const result = await db.sequelize.query(`SELECT GetNumBlackListedOperators(${endpointid})`, { type: db.sequelize.QueryTypes.SELECT});
  const total_value = result[0][`GetNumBlackListedOperators(${endpointid})`];
          
  return total_value;
}

exports.IsGeolocationAvailable = async(mmc, mnc, lac, cid) => {
//  console.log(`111111111111111111 ${mmc}, ${mnc}, ${lac}, ${cid}`);
  const result = await db.sequelize.query(`SELECT IsGeolocationAvailable(${mmc}, ${mnc}, ${lac}, ${cid})`, { type: db.sequelize.QueryTypes.SELECT});
  const total_value = result[0][`IsGeolocationAvailable(${mmc}, ${mnc}, ${lac}, ${cid})`];
            
  return total_value;
}