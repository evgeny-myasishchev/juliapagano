const path = require('path');
const chance = require('../test/mocks/chance');

module.exports = {
  flickrClient: {
    apiKey: 'dummy-api-key-' + new Date().getTime(),
    userId: 'dummy-user-id-' + new Date().getTime()
  },

  logging: {
    stdout: {
      enabled: false
    },
    file: {
      enabled: true,
      path: 'log/test.log'
    }
  },

  EmailTemplate: {
    baseDir: path.join('test', 'mocks', 'emailTemplates')
  },

  contacts: {
    sendTo: chance.email()
  },

  emailProvider: {
    mailgun: {
      baseUrl: chance.url(),
      user: `mg-user-${chance.word()}`,
      domain: chance.domain(),
      key: `key-${chance.word({ length: 10 })}`
    }
  }
};
