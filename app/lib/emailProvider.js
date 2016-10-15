'use strict';

const config = require('config');
const logging = require('../logging');
const request = require('request-promise');

const logger = logging.getLogger();
const mailgunCfg = config.get('emailProvider.mailgun');

function sendEmail(params) {
  const url = [mailgunCfg.baseUrl, mailgunCfg.domain, 'messages'].join('/');
  const { from, to, subject, text, html } = params;
  const log = logger.child({ url, from, to, subject });
  log.debug('Sending email');
  return request.post({
    url: url,
    form: {
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html
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
