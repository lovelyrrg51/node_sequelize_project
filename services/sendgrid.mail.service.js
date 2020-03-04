const sendgridMail = require('@sendgrid/mail');
const config = require('../config');

sendgridMail.setApiKey(config.email.sendgrid.apiKey);
module.exports = sendgridMail;
