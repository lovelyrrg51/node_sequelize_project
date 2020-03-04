exports.render = data => 'Hello,<br/><br/>'
  + `Thank you for signing up! Please confirm your email by clicking here: ${data.link}<br/><br/>`
  + 'Thank you,<br/>'
  + `The ${data.project} Team`;
