'use strict';

const _ = require('lodash');
const chai = require('chai');
const chance = require('./mocks/chance');
const co = require('co');
const config = require('config');
const emailProvider = require('../app/lib/emailProvider');
const EmailTemplate = require('../app/lib/EmailTemplate');
const nock = require('nock');
const sinon = require('sinon');

const expect = chai.expect;
const mailgunCfg = config.get('emailProvider.mailgun');

describe('emailProvider', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
    nock.cleanAll();
  });

  describe('sendEmail', () => {
    it('should post email data to mailgun', co.wrap(function * () {
      const subject = `Subj ${chance.word()}`;
      const html = `Body html ${chance.word()}`;
      const text = `Body txt ${chance.word()}`;
      const template = new EmailTemplate('some-path', { fake: 'data' });
      sandbox.stub(template, 'render').resolves({
        html, text, subject
      });
      const from = chance.email();
      const to = chance.email();
      let scope = nock(mailgunCfg.baseUrl)
        .post(`/${mailgunCfg.domain}/messages`)
        .reply(200, function (url, body) {
          const formData = _.fromPairs(decodeURIComponent(body).split('&').map((part) => part.split('=')));
          expect(formData).to.eql({
            from, to,
            subject: `${config.get('emailProvider.subjectPrefix')}${subject}`,
            text, html
          });
          expect(this.req.headers.authorization).to.eql('Basic ' + Buffer.from([
            mailgunCfg.user, mailgunCfg.key
          ].join(':')).toString('base64'));
        });

      yield emailProvider.sendEmail({ from, to, template });
      scope.done();
    }));
  });
});
