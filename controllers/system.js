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
const systemFunctions = require('./system_functions');

const {sendEmailTemplate, reducedErrorMessage, errorResponse } = require('../modules/utils');

exports.setUserSetting = async(req, res, next) => {
  passport.authenticate('local-jwt', (err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');
    
    const encrypted_new_password = rijndael.encrypt(req.body.password);
    models.tbusers.findOne({
      where: {
        email: user.email,
        deleted: 0
      }
    }).then((User) => {
      if (!User) return errorResponse(res, 'Invalid User E-mail.');

      User.update({
        name: req.body.name,
        password: encrypted_new_password
      });

      models.tblogs.create({
        operationid: config.useroperations.USER_EDITED,
        organisationid: user.organisationid,
        userid: user.userid,
        time_stamp: moment().format('YYYY-MM-DD HH:mm:ss')
      }).then((log) => {
        if (!log) return errorResponse(res, 'Create log failure');
      });

      return res.status(httpStatus.OK).json({ status: 'SUCCESS', message: 'Change user settings successfully.'});
    }).catch(err => errorResponse(res, reducedErrorMessage(err)));
  })(req, res, next);
}

exports.getOrganisationSetting = async(req, res, next) => {
    passport.authenticate('local-jwt', (err, user, info) => {
      // if(err) { return next(err); }
      if(err) { return next(err); }
      if(!user)
        return errorResponse(res, 'Invalid User E-mail.');
      
      models.tborganisations.findOne({
        where: {
          organisationid: user.organisationid
        },
        include: [
          {
            model: models.tbcurrencies
          }
        ]
      }).then((Organisation) => {
          if (!Organisation)    errorResponse(res, 'Invalid User Organisation');

          return res.status(httpStatus.OK).json(Organisation);
      }).catch(err => errorResponse(res, reducedErrorMessage(err)));
    })(req, res, next);
}

exports.getOrdersSetting = async(req, res, next) => {
  var details_value;

  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');
    
    models.tborders.findAll({
      where: {
        organisationid: user.organisationid,
        deleted: 0
      },
      order:[
        ['placed', 'DESC']
      ]
    }).then(async (Orders) => {
      const resObj =  await Promise.all(Orders.map(async(order) => {

        result = await db.sequelize.query(`SELECT GetOrderDetails(${order.orderid})`, { type: db.sequelize.QueryTypes.SELECT});
        details_value = result[0][`GetOrderDetails(${order.orderid})`];

        return Object.assign(
          {},
          {
            orderid: order.orderid,
            placed: order.placed,
            fulfilled: order.fulfilled,
            cancelled: order.cancelled,
            details: details_value,
            notes: order.notes
          }
        )
      }));
      return res.status(httpStatus.OK).json(resObj);
    }).catch(err => errorResponse(res, reducedErrorMessage(err)));
  })(req, res, next);
}

exports.getPlaceOrderSetting = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    let currencyid;
    await models.tborganisations.findOne({
      where: {
        organisationid: user.organisationid
      }
    }).then(async(Organisation) => {
      currencyid = Organisation.currencyid;
    });  

    models.tbplans.findAll({
      include: [{
        model: models.tbcurrencies,
        attributes: [],
        where: {
          currencyid
        }  
      }],
      through: 'tbcosts',
      attributes: ['planid', 'name']
    }).then(async(Plans) => {
      const resObj = Plans.map(plan => {
        return Object.assign(
          {
            plan_id: plan.planid,
            name: plan.name
          }
        );
      })
      return res.status(httpStatus.OK).json(resObj);
    }).catch(err => errorResponse(res, reducedErrorMessage(err))); 
  })(req, res, next);
}

exports.saveNewOrderSetting = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    await models.tborders.create({
      organisationid: user.organisationid,
      placed: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
      notes: req.body.notes
    }).then(async(Neworder) => {
      if (!Neworder)   return errorResponse(res, 'Failed to create new order.');

      await req.body.plans.map(async(plan) => {
        models.tborder_details.create({
          orderid: Neworder.orderid,
          qty: plan.qty,
          planid: plan.planid
        }).then(async(new_order_detail) => {
          if (!new_order_detail)  return errorResponse(res, 'Failed to create new order_detail.');
});
      });

      await models.tblogs.create({
        operationid: config.useroperations.ORDER_ADDED,
        organisationid: user.organisationid,
        userid: user.userid,
        time_stamp: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
        param1: Neworder.orderid
      }).then(async(log) => {
        if (!log) return errorResponse(res, 'Create log failure');
      });

      await models.tbusers.findOne({
        include:[
          {
            model: models.tborganisations
          }
        ],
        where :{
          email: user.email
        }
      }).then(async(User) => {
        if (!User)  return errorResponse(res, 'Invalid User email.');
  
        const auth_token = await simserver.getAuthenticate(User.email, User.password, 1);
        if (!auth_token) return errorResponse(res, 'Failed to send message to server');
        console.log(`Auth_Token: ${auth_token}`);  

        const result = await db.sequelize.query(`SELECT GetOrderDetails(${Neworder.orderid})`, { type: db.sequelize.QueryTypes.SELECT});
        const details_value = result[0][`GetOrderDetails(${Neworder.orderid})`];

        const msgBody = `<p><strong>Data:</strong> ${moment.utc().format('YYYY-MM-DD HH:mm:ss')}</p>` + 
                        `<p><strong>Empresa:</strong> ${encodeURI(User.tborganisation.legal_name)}</p>` + 
                        `<p><strong>${encodeURI("Usuário:")}</strong> ${encodeURI(User.name)} ${encodeURI(User.email)}</p>` +
                        `<p><strong>Detalhes:</strong> ${encodeURI(details_value)}</p>` + 
                        `<p><strong>${encodeURI("Comentários:")}</strong> ${encodeURI(Neworder.notes)}</p>`;

        const sendmailres = await simserver.sendMessageToSalesTeam(msgBody, auth_token);
        if (!sendmailres) return errorResponse(res, 'Failed to send message to server');   
      });      
    });

    return res.status(httpStatus.OK).json({ status: 'SUCCESS', message: '!!!'});
  })(req, res, next);
}

exports.getCurrentMonthSummarySetting = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    const activeSIMCardsGoldCount = await systemFunctions.GetActiveSIMCardsGold(res, user.organisationid);
    const totalSIMCardsGoldCount = await systemFunctions.GetTotalSIMCardsGold(res, user.organisationid);
    const activeSIMCardsDiamondCount = await systemFunctions.GetActiveSIMCardsDiamond(res, user.organisationid);
    const totalSIMCardsDiamondCount = await systemFunctions.GetTotalSIMCardsDiamond(res, user.organisationid);
    const totalTx = await systemFunctions.GetTotalTx(user.organisationid);
    const totalRx = await systemFunctions.GetTotalRx(user.organisationid);
    const totalData = await systemFunctions.GetTotalData(user.organisationid);
    const totalSurplusGold = await systemFunctions.GetTotalSurplusGold(user.organisationid);
    const totalSurplusDiamond = await systemFunctions.GetTotalSurplusDiamond(user.organisationid);
    const totalValue = await systemFunctions.GetTotal(user.organisationid);

    const data = {
      activeSIMCardsGold: activeSIMCardsGoldCount,
      totalSIMCardsGold: totalSIMCardsGoldCount,
      activeSIMCardsDiamond: activeSIMCardsDiamondCount,
      totalSIMCardsDiamond: totalSIMCardsDiamondCount,
      totalTx: totalTx[0].SumTx,
      totalRx: totalRx[0].SumRx,
      totalData: totalData[0].SumTotal,
      totalSurplusGold: totalSurplusGold[0].SumSurplusGold,
      totalSurplusDiamond: totalSurplusDiamond[0].SumSurplusDiamond,
      totalCost: totalValue
    };

    return res.status(httpStatus.OK).json({ status: 'SUCCESS', data: data});
  })(req, res, next);
}

exports.getBillingListSetting = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    const Op = sequelize.Op;
    models.tbmonthly_summaries.findAll({
      where:{
        organisationid: user.organisationid,
        cost :{
          [Op.gt]: 0
        }  
      },
      attributes:['organisationid', 'xls_report', 'pdf_report', 'dt', 'active_simcards_gold', 'total_simcards_gold', 'active_simcards_diamond', 'total_simcards_diamond',
                  'tx', 'rx', 'total', 'surplus_gold', 'surplus_diamond', 'cost']
    }).then(async(Summaries) => {
      const resObj =  await Promise.all(Summaries.map(async(summary) => {
        return Object.assign(
          {},
          {
            xls_report: summary.xls_report,
            pdf_report: summary.pdf_report,
            dt: summary.dt,
            activeSIMCardsGold: summary.active_simcards_gold,
            totalSIMCardsGold: summary.total_simcards_gold,
            activeSIMCardsDiamond: summary.active_simcards_diamond,
            totalSIMCardsDiamond: summary.total_simcards_diamond,
            tx: summary.tx,
            rx: summary.rx,
            total: summary.total,
            surplus_gold: summary.surplus_gold,
            surplus_diamond: summary.surplus_diamond,
            total_cost: summary.cost
          }
        )
      }));
      return res.status(httpStatus.OK).json(resObj);
    });    
  })(req, res, next);
}

exports.getBillingDetailListSetting = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    const Op = sequelize.Op;
    
    models.tbsimcards.findAll({
      include: [
        {
          model: models.tbplans,
          attributes: ['name']
        },
        {
          model: models.tbdatausage_monthly,
          where: {
            cost: {
              [Op.gt]: 0
            },
            dt: req.body.report_date
          },
          attributes: ['tx', 'rx', 'total']
        }
      ],
      where: {
        organisationid: user.organisationid
      },
      attributes: ['simcardid', 'name', 'iccid']
    }).then(async(Simcards) => {
      const resObj =  await Promise.all(Simcards.map(async(simcard) => {
        return Object.assign(
          {},
          {
            simcardid: simcard.simcardid,
            name: simcard.name,
            iccid: simcard.iccid,
            plan_name: simcard.tbplan.name,
            tx: simcard.tbdatausage_monthly.tx,
            rx: simcard.tbdatausage_monthly.rx,
            total: simcard.tbdatausage_monthly.total
          }
        )
      }));
      return res.status(httpStatus.OK).json(resObj);
    });
  })(req, res, next);
}

exports.getLogUserListSetting = async(req, res, next) =>{
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    const Users = await systemFunctions.GetLogUserList(user.organisationid);

    return res.status(httpStatus.OK).json(Users);
  })(req, res, next);
}

exports.getUserLogsSetting = async(req, res, next) => {
  passport.authenticate('local-jwt', async(err, user, info) => {
    // if(err) { return next(err); }
    if(err) { return next(err); }
    if(!user)
      return errorResponse(res, 'Invalid User E-mail.');

    const Op = sequelize.Op;
    var initialdatetime = moment("2000-01-01 00:00:00").format('YYYY-MM-DD HH:mm:ss');
    var finaldatetime = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    var initialcondition = {}, userinitialcondition = {};

    if (req.body.userid > 0)
      userinitialcondition.userid = req.body.userid;      
    if (req.body.useroperation >= 0)
      initialcondition.operationid = req.body.useroperation;
    if (req.body.startdate)
      initialdatetime = moment(req.body.startdate).format('YYYY-MM-DD HH:mm:ss');
    if (req.body.enddate)
      finaldatetime = moment(req.body.enddate).format('YYYY-MM-DD HH:mm:ss');

    models.tblogs.findAndCountAll({
      include: [{
        model: models.tbusers,
        where: [
          userinitialcondition,
          {organisationid: user.organisationid}
        ],
        attributes: ['name']
      }],      
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
      limit: req.body.LineCount
    }).then(async (UserLogs) => {
      return res.status(httpStatus.OK).json(UserLogs);
    });
  })(req, res, next);
}
