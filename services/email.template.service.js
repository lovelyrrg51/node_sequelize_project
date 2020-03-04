const config = require('../config');

exports.getRenderedTemplate = (templateName, data) => {
  try {
    const template = require(`../templates/emails/${config.email.template.folder}/${templateName}`); //eslint-disable-line
    return template.render(data);
  } catch(error) {
    console.log('getRenderedTemplate error: ', error);
  }
  return '';
};
