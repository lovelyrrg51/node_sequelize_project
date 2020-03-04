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

exports.getMaingridEditMenuInfo = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    models.tbsimcards.findOne({
      where:{
          simcardid: req.body.simcardid
      },
      attributes:['iccid', 'name', 'spid', 'alert_80perc_plan', 'alert_100perc_plan', 'alert_blocked_traffic_exceeded']
    }).then(async(Simcard) => {
      if (!Simcard)
        return errorResponse(res, 'Invalid Simcard.');

      return res.status(httpStatus.OK).json(Simcard);
    })
  })(req, res, next);
}

exports.getMaingridEditMenuTrafficLimit = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    models.tbservice_profiles.findAll({
      where:{
        account_index: req.body.account_index
      },
      attributes: ['spid', 'mbs_per_month'],
      order: ['mbs_per_month']
    }).then(async(Profiles) => {
      if(!Profiles)
        return errorResponse(res, 'Invalid Service Profiles.');
      
      return res.status(httpStatus.OK).json(Profiles);
    })
  })(req, res, next);
}

exports.setMaingridEditMenuInfo = async(req, res, next) => {
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
    
        if (Simcard.spid !== req.body.spid) {
          const auth_token = await simserver.getAuthenticate(User.email, User.password, 1);
          const result = await simserver.setSimCardDetailsForWebService(Simcard.tbplan.account_index, Simcard.simcardid, Simcard.iccid, Simcard.endpointid, req.body.spid, auth_token);
        }

        await Simcard.update({
          name: req.body.name,
          spid: req.body.spid, 
          alert_80perc_plan: req.body.alert_80perc_plan,
          alert_100perc_plan: req.body.alert_100perc_plan,
          alert_blocked_traffic_exceeded: req.body.alert_blocked_traffic_exceeded
        });

        await models.tblogs.create({
          operationid: config.useroperations.SIMCARD_EDITED,
          organisationid: User.organisationid,
          userid: User.userid,
          time_stamp: moment.format('YYYY-MM-DD HH:mm:ss'),
          param1: Simcard.simcardid
        }).then((log) => {
          if (!log) return errorResponse(res, 'Create log failure');
        });

        return res.status(httpStatus.OK).json({status: 'ok'});
      });    
    });
  
  })(req, res, next);
}
 
exports.getMaingridDataUsageMenuMonth = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');
 
    const Op = sequelize.Op;
    var initialdatetime = moment("2000-01-01").format('YYYY-MM-DD');
    var finaldatetime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  
    if (req.body.startdate)
      initialdatetime = moment(req.body.startdate).format('YYYY-MM-DD');
    if (req.body.enddate)
      finaldatetime = moment(req.body.enddate).format('YYYY-MM-DD');
  
    models.tbdatausage_monthly.findAndCountAll({
      where: {
        [Op.and]: [
          { endpointid: req.body.endpointid },
          { [Op.and]:[
            {dt: {[Op.gte]: initialdatetime}},
            {dt: {[Op.lte]: finaldatetime}}
          ]} 
        ]
      },
      offset: (req.body.PageNumber - 1) * req.body.LineCount,
      limit: req.body.LineCount,
      attributes: ['dt', 'rx', 'tx', 'total']
    }).then(async (Datausages) => {
      return res.status(httpStatus.OK).json(Datausages);
    });
  })(req, res, next);
}

exports.getMaingridDataUsageMenuDay = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');
 
    const Op = sequelize.Op;
    var initialdatetime = moment("2000-01-01").format('YYYY-MM-DD');
    var finaldatetime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  
    if (req.body.startdate)
      initialdatetime = moment(req.body.startdate).format('YYYY-MM-DD');
    if (req.body.enddate)
      finaldatetime = moment(req.body.enddate).format('YYYY-MM-DD');
  
    models.tbdatausage_daily.findAndCountAll({
      where: {
        [Op.and]: [
          { endpointid: req.body.endpointid },
          { [Op.and]:[
            {dt: {[Op.gte]: initialdatetime}},
            {dt: {[Op.lte]: finaldatetime}}
          ]} 
        ]
      },
      offset: (req.body.PageNumber - 1) * req.body.LineCount,
      limit: req.body.LineCount,
      attributes: ['dt', 'rx', 'tx', 'total']
    }).then(async (Datausages) => {
      return res.status(httpStatus.OK).json(Datausages);
    });
  })(req, res, next);
}

exports.getMaingridEventsMenuList = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');
 
    const Op = sequelize.Op;
    var initialdatetime = moment("2000-01-01").format('YYYY-MM-DD HH:mm:ss');
    var finaldatetime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var initialcondition = {};
    initialcondition.simcardid = req.body.simcardid;

    if (req.body.event_type >= 0)
      initialcondition.event_type = req.body.event_type;

    if (req.body.startdate)
      initialdatetime = moment(req.body.startdate).format('YYYY-MM-DD HH:mm:ss');
    if (req.body.enddate)
      finaldatetime = moment(req.body.enddate).format('YYYY-MM-DD HH:mm:ss');
  
    models.tbevents.findAndCountAll({
      include: [
        {
          model: models.tbcountries,
          attributes: ['iso_code']
        },
        {
          model: models.tboperators,
          attributes: ['name']
        }
      ],
      where: {
        [Op.and]: [
          initialcondition,
          { [Op.and]:[
            {time_stamp: {[Op.gte]: initialdatetime}},
            {time_stamp: {[Op.lte]: finaldatetime}}
          ]} 
        ]
      },
      offset: (req.body.PageNumber - 1) * req.body.LineCount,
      limit: req.body.LineCount,
      attributes: ['event_severity', 'time_stamp', 'rat', 'imei', 'event_type', 'description_en', 'description_es', 'description_ptbr', 'data_rx', 'data_tx']
    }).then(async (Events) => {
      return res.status(httpStatus.OK).json(Events);
    });
  })(req, res, next);
}

exports.setSimcardSuspend = async(req, res, next) => {
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
        const result = await simserver.setSimCardSuspend(Simcard.tbplan.account_index, Simcard.simcardid, Simcard.iccid, Simcard.endpointid, auth_token);

        // await Simcard.update({
        //   name: req.body.name,
        //   spid: req.body.spid, 
        //   alert_80perc_plan: req.body.alert_80perc_plan,
        //   alert_100perc_plan: req.body.alert_100perc_plan,
        //   alert_blocked_traffic_exceeded: req.body.alert_blocked_traffic_exceeded
        // });

        await models.tblogs.create({
          operationid: config.useroperations.SIMCARD_SUSPENDED,
          organisationid: User.organisationid,
          userid: User.userid,
          time_stamp: moment().format('YYYY-MM-DD HH:mm:ss'),
          param1: Simcard.simcardid
        }).then((log) => {
          if (!log) return errorResponse(res, 'Create log failure');
        });

        return res.status(httpStatus.OK).json({status: 'ok'});
      });    
    });
  
  })(req, res, next);
}

exports.setSimcardActivate = async(req, res, next) => {
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
        }, {
          model: models.tborganisations,
          attributes: ['currencyid', 'payment_type']
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
        
        if (Simcard.tborganisation.payment_type === 1 && Simcard.cost === 0) {
          const result = await db.sequelize.query(`SELECT ReadAmount(${Simcard.planid},${Simcard.tborganisation.currencyid},${config.cost_type.MONTHLY_FEE_COST_TYPE})`, { type: db.sequelize.QueryTypes.SELECT});
          const monthly_fee = result[0][`ReadAmount(${Simcard.planid},${Simcard.tborganisation.currencyid},${config.cost_type.MONTHLY_FEE_COST_TYPE})`];

          const result_wallet = await db.sequelize.query(`SELECT GetWalletBalance(${Simcard.organisationid})`, { type: db.sequelize.QueryTypes.SELECT});
          const wallet_balance = result_wallet[0][`GetWalletBalance(${Simcard.organisationid})`];

          if (wallet_balance < result_wallet)
            return errorResponse(res, 'There is no enough balance on the digital wallet in order to activate this SIM-Card!');

          console.log(`momthly_cost: ${monthly_fee} ${wallet_balance}`);
          
          await models.tbwallet.create({
            organisationID: Simcard.organisationid,
            adminid: 0,
            description: `SIM-Card Monthly Fee (Activation, ICCID: {${Simcard.iccid}})`,
            amount: -monthly_fee,
            time_stamp: moment().format('YYYY-MM-DD HH:mm:ss')
          }).then(async(newWallet) => {
            if (!newWallet)
              return errorResponse(res, 'Failure while deducting SIM-Card monthly fee from digital wallet!');

            await models.tblogs.create({
              operationid: config.useroperations.WALLET_WITHDRAW,
              organisationid: Simcard.organisationid,
              time_stamp: moment().format('YYYY-MM-DD HH:mm:ss'),
              param1: newWallet.transactionID,
              userid: User.userid
            }).then(async(newLog) => {              
            });

            await Simcard.update({
              cost: monthly_fee
            });
          });
        }

        const auth_token = await simserver.getAuthenticate(User.email, User.password, 1);
        const result = await simserver.setSimCardActivate(Simcard.tbplan.account_index, Simcard.simcardid, Simcard.iccid, Simcard.endpointid, auth_token);

        if (result === 0)
          return errorResponse(res, 'Failure with activating Simcard.');

        if (Simcard.activation_deadline > moment().format('YYYY-MM-DD hh:mm:ss')){
          await Simcard.update({
            activation_deadline: null
          });
        }

        await models.tblogs.create({
          operationid: config.useroperations.SIMCARD_SUSPENDED,
          organisationid: User.organisationid,
          userid: User.userid,
          time_stamp: moment().format('YYYY-MM-DD HH:mm:ss'),
          param1: Simcard.simcardid
        }).then((log) => {
        });

        return res.status(httpStatus.OK).json(Simcard);
      });    
    });
  
  })(req, res, next);
}

exports.resetSimcardConnection = async(req, res, next) => {
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

      const auth_token = await simserver.getAuthenticate(User.email, User.password, 1);

      const result = await simserver.resetSimConnection(req.body.simcardid, auth_token);

      if (result === 1)
        return res.status(httpStatus.OK).json({status: 'Successfully reset-connection.'});
      else
        return errorResponse(res, 'Invalid reset-connection');
    });
  })(req, res, next);
}

exports.getCountriesList = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    models.tbcountries.findAll({
      attributes: ['countryid', 'name', 'iso_code']
    }).then(async(Countries) => {
      if (!Countries) 
        return errorResponse(res, 'Invalid countries');

      return res.status(httpStatus.OK).json(Countries);
    })
  })(req, res, next);
}

exports.getOperatorsList = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    models.tboperators.findAll({
      where: {
        countryid: req.body.countryid
      }
    }).then(async(Operators) => {
      if (!Operators)
        return errorResponse(res, 'Invalid Operators');

      return res.status(httpStatus.OK).json(Operators);
    });
  })(req, res, next);
}

exports.setMaingridBlacklistOperators = async(req, res, next) => {
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
      await models.tbsimcards.findOne({
        include: [{
          model: models.tbplans,
          attributes: ['account_index']
        }],
        where:{
          simcardid: req.body.simcardid
        }
      }).then(async(Simcard) => {
        if (!Simcard)
          errorResponse(res, 'Invalid Simcard');
  
        const auth_token = await simserver.getAuthenticate(User.email, User.password, 1);
        const result = await simserver.blacklistedOperators(Simcard.tbplan.account_index, Simcard.simcardid, Simcard.iccid, Simcard.endpointid, req.body.blacklistedOperators, auth_token);

        if (result === 0)
          errorResponse(res, 'Invalid create blacklist');

        await models.tboperator_blacklist.findAll({
          endpointid: Simcard.endpointid
        }).then(async(Operators) => {
          for (i = 0; i < req.body.blacklistedOperators.length; i ++) {
            if (i < Operators.length && Operators[i].operatorid !== req.body.blacklistedOperators[i]){
              await Operators[i].update({
                endpointid: Simcard.endpointid,
                operatorid: req.body.blacklistedOperators[i]
              });
              await models.tblogs.create({
                operationid: config.useroperations.OPERATOR_BLACKLIST_EDITED,
                organisationid: User.organisationid,
                userid: User.userid,
                time_stamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                param1: Simcard.simcardid,
                param2: req.body.blacklistedOperators[i]
              }).then((log) => {
              });
            }
            else {            
              await models.tboperator_blacklist.create({
                endpointid: Simcard.endpointid,
                operatorid: req.body.blacklistedOperators[i]
              }).then(async(Blacklist) => {
                if (!Blacklist)
                  errorResponse(res, 'Invalid Blacklist');

                await models.tblogs.create({
                  operationid: config.useroperations.OPERATOR_ADDED_TO_BLACKLIST,
                  organisationid: User.organisationid,
                  userid: User.userid,
                  time_stamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                  param1: Simcard.simcardid,
                  param2: req.body.blacklistedOperators[i]
                }).then((log) => {
                });
              });
            }
          }
        });
        return res.status(httpStatus.OK).json({result: 'success'});
      }); 
    });
  })(req, res, next);
}

exports.getMaingridBlacklistOperators = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    await models.tbsimcards.findOne({
      where:{
        simcardid: req.body.simcardid
      }
    }).then(async(Simcard) => {
      if (!Simcard)
        errorResponse(res, 'Invalid Simcard');

      await models.tboperator_blacklist.findAll({
        include: [{
          model: models.tboperators,
          attributes: ['name']
        }],
        where: {
          endpointid: Simcard.endpointid
        }
      }).then(async(Operators) => {
        return res.status(httpStatus.OK).json(Operators);
      });
    }); 
  })(req, res, next);
}

exports.removeMaingridBlacklistOperator = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    await models.tboperator_blacklist.destroy({
      where: {
        endpointid: req.body.endpointid,
        operatorid: req.body.operatorid
      }
    }).then(function(){    
     return res.status(httpStatus.OK).json({status: 'success'});
    });
  })(req, res, next);
}