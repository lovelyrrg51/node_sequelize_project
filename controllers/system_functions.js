const models = require('../models');
const httpStatus = require('http-status');
const config = require('../config');
const sequelize = require('sequelize');
const db = require('../models');

const {sendEmailTemplate, reducedErrorMessage, errorResponse } = require('../modules/utils');

exports.GetActiveSIMCardsGold = async(res, organisationid) => {
  const simCardGoldCount = await models.tbsimcards.count({
    include:[{
      model: models.tbplans,
      where:{
        account_index: config.GOLD_ACCOUNT_INDEX
      }
    }],
    where:{
      organisationid,
      status: config.SIM_Status.ACTIVATED
    }
  }).then()
  .catch(err => errorResponse(res, reducedErrorMessage(err)));

  return simCardGoldCount;
};

exports.GetTotalSIMCardsGold = async(res, organisationid) => {
  const totalSimCardGoldCount = await models.tbsimcards.count({
    include:[{
      model: models.tbplans,
      where:{
        account_index: config.GOLD_ACCOUNT_INDEX
      }
    }],
    where:{
      organisationid
    }
  }).then()
  .catch(err => errorResponse(res, reducedErrorMessage(err)));

  return totalSimCardGoldCount;
};

exports.GetActiveSIMCardsDiamond = async(res, organisationid) => {
  const activeSIMCardsDiamondCount = await models.tbsimcards.count({
    include:[{
      model: models.tbplans,
      where:{
        account_index: config.DIAMOND_ACCOUNT_INDEX
      }
    }],
    where:{
      organisationid,
      status: config.SIM_Status.ACTIVATED
    }
  }).then()
  .catch(err => errorResponse(res, reducedErrorMessage(err)));
  
  return activeSIMCardsDiamondCount;
};

exports.GetTotalSIMCardsDiamond = async(res, organisationid) => {
  const totalSimCardDiamondCount = await models.tbsimcards.count({
    include:[{
      model: models.tbplans,
      where:{
        account_index: config.DIAMOND_ACCOUNT_INDEX
      }
    }],
    where:{
      organisationid
    }
  }).then()
  .catch(err => errorResponse(res, reducedErrorMessage(err)));
  
  return totalSimCardDiamondCount;
};

exports.GetTotalTx = async(organisationid) => {
  const toResult = await models.tbsimcards.findAll({
    where:{
      organisationid: organisationid
    },
    attributes: [[sequelize.fn('sum', sequelize.col('tx')), 'SumTx']],
    raw: true
  });

  return toResult;
}

exports.GetTotalRx = async(organisationid) => {
  const toResult = await models.tbsimcards.findAll({
    where:{
      organisationid: organisationid
    },
    attributes: [[sequelize.fn('sum', sequelize.col('rx')), 'SumRx']],
    raw: true
  });
  
  return toResult;
}

exports.GetTotalData = async(organisationid) => {
  const toResult = await models.tbsimcards.findAll({
    where:{
      organisationid: organisationid
    },
    attributes: [[sequelize.fn('sum', sequelize.col('total')), 'SumTotal']],
    raw: true
  });
    
  return toResult;
}
 
exports.GetTotalSurplusGold = async(organisationid) => {
  const toResult = await models.tbsimcards.findAll({
    where:{
      organisationid: organisationid
    },
    attributes: [[sequelize.fn('sum', sequelize.col('surplus_gold')), 'SumSurplusGold']],
    raw: true
  });
      
  return toResult;
}

exports.GetTotalSurplusDiamond = async(organisationid) => {
  const toResult = await models.tbsimcards.findAll({
    where:{
      organisationid: organisationid
    },
    attributes: [[sequelize.fn('sum', sequelize.col('surplus_diamond')), 'SumSurplusDiamond']],
    raw: true
  });
        
  return toResult;
}
 
exports.GetTotal = async(organisationid) => {
  const result = await db.sequelize.query(`SELECT GetSumSIMCardsCost(${organisationid})`, { type: db.sequelize.QueryTypes.SELECT});
  const total_value = result[0][`GetSumSIMCardsCost(${organisationid})`];
    
  return total_value;
}

exports.GetLogUserList = async(organisationid) => {
  const result = await models.tbusers.findAll({include: { model: models.tblogs, where: { organisationid: organisationid }, attributes:[] }, attributes: ['userid', 'name']});
  return result;
}