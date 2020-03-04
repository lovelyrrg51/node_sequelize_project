const mailer = require('./sendgrid.mail.service');

exports.send = (from, to, subject, text) => mailer.send({
  to,
  from,
  subject,
  html: text
});
