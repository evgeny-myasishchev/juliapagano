'use strict';

const co = require('co');
const emailProvider = require('../app/lib/emailProvider');

describe('emailProvider', () => {
  describe('sendEmail', () => {
    it('should post email data to mailgun', co.wrap(function * () {
      yield emailProvider.sendEmail('Hello world');
    }));
  });
});
