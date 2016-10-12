'use strict';

const config = require('config');
const logging = require('../logging');
const request = require('request-promise');

const logger = logging.getLogger();
const mailgunCfg = config.get('emailProvider.mailgun');

function sendEmail() {
  const url = [mailgunCfg.baseUrl, mailgunCfg.domain, 'messages'].join('/');
  logger.debug({ url }, 'Sending email');
  return request.post({
    url: url
  });
}

module.exports = {
  sendEmail: sendEmail
};
