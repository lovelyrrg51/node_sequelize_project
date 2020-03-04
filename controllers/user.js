const models = require('../models');
const uuidV4 = require('uuid/v4');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config');
const AES = require('../config/aes_encryption');
const rijndael = require('../config/rijndael');
const passport = require('passport');
const sequelize = require('sequelize');

const {sendEmailTemplate, reducedErrorMessage, errorResponse } = require('../modules/utils');

exports.singupUser = async (req, res) => { // eslint-disable-line
  models.tbusers.create ({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
   }).then((obj) => 
    {
      if(obj)
      {
        return res.json({ status: 'ok', data: obj});
      }
      else
      {
        return res.json({ status: 'fail', message: "user signup failed"});
      }
    }
  )
};

exports.loginUser = async (req, res) => { // eslint-disable-line  
  models.tbusers.findOne({
    include: [
      {
        model: models.tborganisations
      }
    ],
    where: {
      email:req.body.email
    }
  }).then(User => {
    if (!User)  return res.json({ status: 'error', message: 'Invalid e-mail address!'});
    if (User.tbOrganisation.lock_status)
      return res.json({ status: 'error', message: 'Your organisation is blocked!\nPlease contact SIM Anywhere Customer Service for more details'});
    if (!User.enabled)
      return res.json({ status: 'error', message: 'Your user is disabled'});

    const decrypt_password = rijndael.decrypt(User.password);
    if (req.body.password !== decrypt_password)
      return res.json({ status: 'error', message: 'Incorrect Password.'});
    
  }).catch(err => errorResponse(res, reducedErrorMessage(err)));
};

exports.invalidEmailCheck =  (req, res) => {
  models.tbusers.findOne({
    where: {email: req.body.email}
  }).then((User) => {
      if (!User) return res.json({ status: 'error', message: 'Invalid e-mail address!'});
      return res.json({ status: 'success', message:'This is valid e-mail address!'});
  });
}

exports.sendResetPasswordToken = async(req, res) => {
  models.tbusers.findOne({
    where: {
      email: req.body.email,
      deleted: 0
    }
  }).then((User) => {
    if (!User) return res.status(httpStatus.OK).json({ status: 'USER_DISABLED', message: 'The user is disabled.'});

    const resetPasswordTokenExpiration = moment().add(config.RESET_PASSWORD_EXPIRATION, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const data = { email: `${req.body.email}`, tokenexpiration: `${resetPasswordTokenExpiration}`};
    const encrypted_data = AES.encrypt(JSON.stringify(data));

//    const subject = 'Password Reset Token';
    
//    sendEmailTemplate(User, subject, 'password-reset-token', {encrypted_data});
    return res.status(httpStatus.OK).json({ status: 'SUCCESS', resetPasswordToken: encrypted_data});
//      return res.status(httpStatus.OK).json({ status: 'FAILED_TO_SEND_MSG', message: 'SIM Anywhere Server failed to send the e-mail with the password reset token.'});
//    return res.status(httpStatus.OK).json({ status: 'SUCCESS', message: 'Password reset token was sent successfully.'});
/*    sendEmailTemplate(User, subject, 'password-reset-token', { resetPasswordToken }).then((value) => {
      if (!value) return res.status(httpStatus.OK).json({ status: 'FAILED_TO_SEND_MSG', message: 'SIM Anywhere Server failed to send the e-mail with the password reset token.'});
      return res.status(httpStatus.OK).json({ status: 'SUCCESS', message: 'Password reset token was sent successfully.'});
    });*/

  }).catch(err => errorResponse(res, reducedErrorMessage(err)));
}

exports.validatePasswordToken = async(req, res) => {
  const decrypted_data = JSON.parse(AES.decrypt(req.body.resetPasswordToken));

  models.tbusers.findOne({
    where: {
      email: decrypted_data.email
    }
  }).then((User) => {
    if (!User) return errorResponse(res, 'Invalid User E-mail');
    if((moment().isAfter(decrypted_data.tokenexpiration))) {
      return errorResponse(res, 'resetPasswordToken is expired');
    }

    return res.status(httpStatus.OK).json({ status: 'SUCCESS', message: 'You can change your new password.'});
  }).catch(err => errorResponse(res, reducedErrorMessage(err)));
}

exports.resetPassword = async(req, res) => {
  const {password, resetPasswordToken} = req.body;
  const decrypted_data = JSON.parse(AES.decrypt(resetPasswordToken));

  models.tbusers.findOne({
    where: {
      email: req.body.email,
      deleted: 0
    }
  }).then((User) => {
    if (!User) return errorResponse(res, 'Invalid User E-mail.');
    
    if((moment().isAfter(decrypted_data.tokenexpiration))) {
      return errorResponse(res, 'resetPasswordToken is expired');
    }
    
    const encrypted_new_password = rijndael.encrypt(password);
    User.update({
      password: encrypted_new_password
    });   
    
    const subject = 'Password Reset';
    sendEmailTemplate(User, subject, 'password-reset', {});

    return res.status(httpStatus.OK).json({ status: 'SUCCESS', message: 'Changed new password successfully.'});
  }).catch(err => errorResponse(res, reducedErrorMessage(err)));
}
