const models = require('../models');
const uuidV4 = require('uuid/v4');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config');
const AES = require('../config/aes_encryption');
const rijndael = require('../config/rijndael');
const passport = require('passport');
const sequelize = require('sequelize');
const db = require('../models');
const simserver = require('../config/simserver');
const maingrid_functions = require('./maingrid_functions');
const {sendEmailTemplate, reducedErrorMessage, errorResponse } = require('../modules/utils');

exports.getMaingridList = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    var condition = {};
    const Op = sequelize.Op;

    if (req.body.simcardid)
      condition.simcardid = req.body.simcardid;
    else if (req.body.name)
      condition.name = req.body.name;
    else if (req.body.iccid)
      condition.iccid = req.body.iccid;
    else if (req.body.planid)
      condition.planid = req.body.planid;
    else if (req.body.status >= 0)
      condition.status = req.body.status;
    else if (req.body.connectivity_status >= 0 && req.body.rat >= 0){
      condition.connectivity_status = req.body.connectivity_status;
      condition.rat = req.body.rat;
    }
    else if (req.body.imei)
      condition.imei = req.body.imei;
    else if (req.body.ipaddress)
      condition.ipaddress = req.body.ipaddress;

    models.tbsimcards.findAll({
      include: [
        {
          model: models.tbplans,
          attributes: ['account_index', 'name']
        },
        {
          model: models.tborganisations,
          where: {
            organisationid: user.organisationid
          },
          attributes: ['payment_type', 'currencyid'],
          include: [{
            model: models.tbcurrencies,
            attributes: [] 
          }]
        },
        {
          model: models.tboperators,
          attributes: ['name'],
          include: [{
            model: models.tbcountries,
            attributes: ['iso_code']
          }]
        }
      ],
      where: condition,
      attributes: ['simcardid', 'activation_date', 'name', 'iccid', 'planid', 'status', 'connectivity_status', 'endpointid', 'rat', 'imei_locked', 'imei', 'pdp_context_activation', 
                   'pdp_context_duration', 'conn_last_1d', 'conn_last_7d', 'conn_last_30d', 'ipaddress', 'tx', 'rx', 'total', 'activation_deadline', 'cost', 'mcc', 'mnc', 'lac', 'cid'
                  ,'operatorid'],
      offset: (req.body.PageNumber - 1) * req.body.LineCount,
      limit: req.body.LineCount
    }).then(async(SimCards) => {
      const resObj =  await Promise.all(SimCards.map(async(simcard) => {
        const alert_type = await maingrid_functions.GetAlertType(simcard.simcardid);
        const num_blacklisted_operators = await maingrid_functions.GetNumBlackListedOperators(simcard.endpointid);
        const geolocation_available = await maingrid_functions.IsGeolocationAvailable(simcard.mcc, simcard.mnc, simcard.lac, simcard.cid);

        return Object.assign({simcard, alert_type, num_blacklisted_operators, geolocation_available});
      }));

      let sortedObj = await resObj.slice().sort((a, b) => b.alert_type - a.alert_type);
      return res.status(httpStatus.OK).json({count: sortedObj.length, data: sortedObj});
    });
  })(req, res, next);
}

exports.setEmailLockStatus = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    await models.tbusers.findOne({
      where: {
        userid: user.userid
      }
    }).then(async(User) => {
      if (!User)
        return errorResponse(res, 'Invalid User E-mail.');

      await models.tbsimcards.findOne({
        include :[{
          model: models.tbplans,
          attributes: ['account_index']
        }],
        where: {
          simcardid: req.body.simcardid
        },
        attributes:{
          exclude: ['countryid']
        }
      }).then(async(Simcard) => {
        if (!Simcard)
          return errorResponse(res, 'Invalid Simcard');
  
        const auth_token = await simserver.getAuthenticate(User.email, User.password, 1);
        const status = await simserver.setEmailLockStatus(Simcard.tbplan.account_index, Simcard.simcardid, Simcard.iccid, Simcard.endpointid, auth_token, req.body.status);
       
        if (status === 1)
          return res.status(httpStatus.OK).json({status: 'success'});
        else
          return res.status(httpStatus.OK).json({status: 'error'});
      });    
    })

  })(req, res, next);
}

exports.getConnectionsSummary = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    models.tbconnections_stats.findAll({
      include:[{
        model: models.tboperators,
        attributes: ['name']
      }],
      where: {
        simcardid: req.body.simcardid,
        periodicity: req.body.periodicity
      },
      attributes: ['numconnections']
    }).then(async(Connections) => {
      return res.status(httpStatus.OK).json(Connections);
    });
  })(req, res, next);
}

exports.getPlanList = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    models.tbplans.findAll({
      attributes: ['planid', 'name'],
      order: ['name']
    }).then(async(Plans) => {
      if (!Plans)
        return errorResponse(res, 'Invalid Plans.');

      return res.status(httpStatus.OK).json(Plans);
    });
  })(req, res, next);
}

exports.getCountryFilterList = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    const result = await db.sequelize.query('SELECT DISTINCT(tbCountries.COUNTRYID),tbCountries.name, tbCountries.ISO_CODE FROM tbCountries INNER JOIN tbOperators ON tbCountries.COUNTRYID=tbOperators.COUNTRYID INNER JOIN tbSimCards ON tbOperators.OPERATORID=tbSimCards.OPERATORID', { type: db.sequelize.QueryTypes.SELECT});

    return res.status(httpStatus.OK).json(result);
  })(req, res, next);
}

exports.getOperatorFilterList = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    models.tboperators.findAll({
      include:[{
        model: models.tbsimcards,
        attributes: []
      }],
      where: {
        countryid: req.body.countryid
      }
    }).then(async(Operators) => {
      return res.status(httpStatus.OK).json(Operators);
    });
  })(req, res, next);
}