require('dotenv').config();

const httpStatus = require('http-status');
const express = require('express');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const router = express.Router();
const config = require('../config');
const moment = require('moment');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const auth = require('../controllers/auth');
const models = require('../models');
const { getIp, reducedUserData, errorResponse } = require('../modules/utils');


const rateLimiter = new RateLimiterMemory({
  points: 25,
  duration: 60 * 15,
});

const limiterMiddleware = (req, res, next) => {
  const ip = getIp(req);
  rateLimiter.consume(ip)
    .then(() => {
      next();
    })
    .catch(() => { 
      console.log(ip);
      res.status(httpStatus.TOO_MANY_REQUESTS).send('Too many requests');
    });
};

router.post('/register', (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    if(err) { return next(err); }
    if(!user) { return errorResponse(res, info.message); }
    // const token = jwt.sign(JSON.stringify(user), 'secret');
    const token = jwt.sign({ id: user.id }, 'secret');
    return res.status(httpStatus.OK).json({ status: 'ok', data: { user: reducedUserData(user), token } });
  })(req, res, next);
});

router.post('/login', limiterMiddleware, (req, res, next) => {
  passport.authenticate('local-signin', (err, user, info) => {
    if(err) { return next(err); }
    if(!user) {
      return errorResponse(res, info.message);
    }
    
    models.tblogs.create({
      operationid: config.useroperations.LOGGED_IN,
      organisationid: user.organisationid,
      userid: user.userid,
      time_stamp: moment().format('YYYY-MM-DD HH:mm:ss')
    }).then((log) => {
      if (!log) return errorResponse(res, 'Create log failure');
    });
    // const token = jwt.sign(JSON.stringify(user), 'secret');
    const token = jwt.sign({ id: user.userid }, 'secret');
    return res.status(httpStatus.OK).json({ status: 'ok', data: { user: reducedUserData(user), token } });
  })(req, res, next);
});


router.post('/logout', (req, res, next) => {
  
//  req.logout();
//  res.redirect('/');

  passport.authenticate('local-jwt', (err, user, info) => {
    if(err) { return next(err); }
    if(!user) {
      return errorResponse(res, info.message);
    }

    models.tblogs.create({
      operationid: config.useroperations.LOGGED_OUT,
      organisationid: user.organisationid,
      userid: user.userid,
      time_stamp: moment().format('YYYY-MM-DD HH:mm:ss')
    }).then((log) => {
      if (!log) return errorResponse(res, 'Create log failure');
    });

    req.logout();
//    res.redirect('/');

    return res.status(httpStatus.OK).json({ status: 'Successfully Logout'});
  })(req, res, next);
});

// apis
router.get('/confirmemail', auth.confirmEmail);
router.post('/resendconfirmation', auth.resendConfirmEmail);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);
router.post('/invalid_email_check', auth.invalidEmailCheck);

module.exports = router;
