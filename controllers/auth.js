const uuidV4 = require('uuid/v4');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config');
const models = require('../models');
const passport = require('passport');
const { sendEmailTemplate, errorResponse, reducedErrorMessage } = require('../modules/utils');

exports.confirmEmail = (req, res) => {
  const { token } = req.query;

  models.user.findOne({
    where: {
      emailConfirmationToken: {
        $eq: token
      }
    }
  }).then((user) => {
    if(user) {
      if(user.emailConfirmed) {
        return errorResponse(res, 'Email already confirmed');
      }

      // confirm action
      user.update({
        emailConfirmed: true,
        emailConfirmationToken: null,
      });

      sendEmailTemplate(user, 'Email Verified', 'email-verified');

      return res.status(httpStatus.OK).json({ status: 'ok' });
    }
    return errorResponse(res, 'Invalid token');
  }).catch(err => errorResponse(res, reducedErrorMessage(err)));
};

exports.resendConfirmEmail = (req, res) => {
  const { email } = req.body;

  models.user.findOne({
    where: {
      email
    }
  }).then((user) => {
    if(user) {
      const emailConfirmationToken = uuidV4();

      user.update({
        emailConfirmationToken,
      });

      // Send register mail
      const link = `${config.frontendBaseUrl}/api/v1/auth/confirmemail?token=${emailConfirmationToken}`;
      const subject = 'Confirm your email for XXX';
      sendEmailTemplate(user, subject, 'email-verification', { link });

      return res.status(httpStatus.OK).json({ status: 'ok' });
    }
    return errorResponse(res, 'User not found');
  }).catch(err => errorResponse(res, reducedErrorMessage(err)));
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  models.user.findOne({
    where: {
      email: {
        $eq: email
      },
    }
  }).then((user) => {
    if(!user) return errorResponse(res, 'User not found');

    const resetPasswordToken = uuidV4();
    const resetPasswordTokenExpiration = moment().add(config.RESET_PASSWORD_EXPIRATION, 'minutes')
      .format('YYYY-MM-DD HH:mm:ss');
    user.update({
      resetPasswordToken,
      resetPasswordTokenExpiration
    });
    
    const link = `${config.frontendBaseUrl}/resetpassword/${resetPasswordToken}`;
    const subject = 'Password Reset Request';
    sendEmailTemplate(user, subject, 'forgot-password', { link });

    return res.status(httpStatus.OK).json({ status: 'ok' });
  }).catch(err => errorResponse(res, reducedErrorMessage(err)));
};

exports.resetPassword = (req, res) => {
  const { password, resetPasswordToken } = req.body;

  if(!resetPasswordToken) {
    return errorResponse(res, 'resetPasswordToken is empty');
  }
  if(!password) {
    return errorResponse(res, 'new password is empty');
  }

  return models.user.findOne({
    where: {
      resetPasswordToken: {
        $eq: resetPasswordToken
      },
    }
  }).then((user) => {
    if(!user) return errorResponse(res, 'resetPasswordToken is not correct');
    if(!user.resetPasswordTokenExpiration || (moment().isAfter(user.resetPasswordTokenExpiration))) {
      return errorResponse(res, 'resetPasswordToken is expired');
    }
    // Generate new pwd
    const generateHash = _password => (bcrypt.hashSync(_password, bcrypt.genSaltSync(8), null));
    user.update({
      password: generateHash(password)
    });

    const subject = 'Password Reset';
    sendEmailTemplate(user, subject, 'password-reset', { password });

    return res.json({ status: 'ok' });
  }).catch(err => errorResponse(res, reducedErrorMessage(err)));
};

exports.invalidEmailCheck =  (req, res, next) => {
  passport.authenticate('local-jwt', (err, user, info) => {
    // if(err) { return next(err); }
    if(!user)
      return errorResponse(res, info.message);
    return res.status(httpStatus.OK).json({ status: 'okasdfasdf'});
  })(req, res, next);
}
  