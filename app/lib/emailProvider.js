'use strict';

const config = require('config');
const logging = require('../logging');
const request = require('request-promise');

const logger = logging.getLogger();
const mailgunCfg = config.get('emailProvider.mailgun');

function *sendEmail(params) {
  const url = [mailgunCfg.baseUrl, mailgunCfg.domain, 'messages'].join('/');
  const { from, to, template } = params;
  const log = logger.child({ url, from, to, template: template.path });
  log.debug('Sending email');
  const data = yield template.render();
  return request.post({
    url: url,
    form: {
      from: from,
      to: to,
      subject: `${config.get('emailProvider.subjectPrefix')}${data.subject}`,
      text: data.text,
      html: data.html
    }
  })
  .auth(mailgunCfg.user, mailgunCfg.key)
  .then(() => {
    log.debug('Email sent');
  });
}

module.exports = {
  sendEmail: sendEmail
};
