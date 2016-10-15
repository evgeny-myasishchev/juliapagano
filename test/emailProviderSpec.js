'use strict';

const _ = require('lodash');
const chai = require('chai');
const chance = require('./mocks/chance');
const co = require('co');
const config = require('config');
const emailProvider = require('../app/lib/emailProvider');
const nock = require('nock');

const expect = chai.expect;
const mailgunCfg = config.get('emailProvider.mailgun');

describe('emailProvider', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  describe('sendEmail', () => {
    it('should post email data to mailgun', co.wrap(function * () {
      const from = chance.email();
      const to = chance.email();
      const subject = `Subj ${chance.word()}`;
      const html = `Body html ${chance.word()}`;
      const text = `Body txt ${chance.word()}`;
      let scope = nock(mailgunCfg.baseUrl)
        .post(`/${mailgunCfg.domain}/messages`)
        .reply(200, function (url, body) {
          const formData = _.fromPairs(decodeURIComponent(body).split('&').map((part) => part.split('=')));
          expect(formData).to.eql({
            from, to, subject, text: text, html: html
          });
          expect(this.req.headers.authorization).to.eql('Basic ' + Buffer.from([
            mailgunCfg.user, mailgunCfg.key
          ].join(':')).toString('base64'));
        });

      yield emailProvider.sendEmail({ from, to, subject, html, text });
      scope.done();
    }));
  });
});
