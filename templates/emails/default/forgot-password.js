exports.render = data => 'Hello,<br/><br/>'
  + 'It looks like you requested a password reset. If not, please ignore this email.<br/><br/>'
  + `You may reset your password by clicking here: ${data.link}<br/><br/>`
  + 'Thank you,<br/>'
  + `The ${data.project} Team`;
