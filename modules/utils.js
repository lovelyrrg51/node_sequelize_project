const httpStatus = require('http-status');
const _ = require('lodash');
const MailService = require('../services/mail.service');
const EmailTemplateService = require('../services/email.template.service');
const config = require('../config');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dragonwarrior920619@gmail.com',
    pass: 'DragonWarrior123!@#'
  },
  tls:{
    rejectUnauthorized:false
  }
});

const sendEmail = (user, title, text) => {
  const mailOptions = {
    from: config.email.from.support, // sender address
    to: user.email, // list of receivers
    subject: title, // Subject line
    html: text// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
  });
/*  MailService.send(
    config.email.from.support,
    user.email,
    title,
    text,
  ).then(() => {
    console.log('Mail sent successfully');
  }).catch(err => (
    console.log('Mail send error: ', err)
  ));*/
};
exports.sendEmail = sendEmail;

exports.sendEmailTemplate = (user, title, template, args = {}) => {
  const { project, frontendBaseUrl } = config;
  _.assign(args, { project, frontendBaseUrl });
  const text = EmailTemplateService.getRenderedTemplate(template, args);
  sendEmail(user, title, text);
};

exports.validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
  return re.test(String(email).toLowerCase());
};

exports.getIp = function(req) {
  const ip = (req.headers['x-forwarded-for'] || '').split(',').pop()
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || req.connection.socket.remoteAddress;
  return ip;
};

exports.errorResponse = (res, message) => res.status(httpStatus.BAD_REQUEST).json({ status: 'error', message });

exports.reducedErrorMessage = (errorDetails) => {
  if(errorDetails.errors && errorDetails.errors.length > 0) {
    return _.get(errorDetails, 'errors[0].message', 'We have some technical difficulties. Please try again.');
  }
  return _.get(errorDetails, 'message', 'We have some technical difficulties. Please try again.');
};

exports.reducedUserData = userDetails => ({
  ..._.omit(userDetails, ['password'])
});
