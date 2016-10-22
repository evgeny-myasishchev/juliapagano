'use strict';

const chai = require('chai');
const chance = require('./mocks/chance');
const co = require('co');
const config = require('config');
const ejs = require('ejs');
const EmailTemplate = require('../app/lib/EmailTemplate');
const fs = require('fs');
const path = require('path');

const expect = chai.expect;

describe('EmailTemplate', () => {
  function renderEjs(templatePath, data) {
    return ejs.render(
      fs.readFileSync(path.join(config.get('EmailTemplate.baseDir'), templatePath)).toString(),
      data
    );
  }

  it('should render provided template with given data', co.wrap(function * () {
    const data = {
      name: chance.name(),
      email: chance.email()
    };
    const template = new EmailTemplate('welcome', data);
    const result = yield template.render();

    expect(result.text).to.eql(renderEjs(path.join('welcome', 'welcome.text.ejs'), data));
    expect(result.html).to.eql(renderEjs(path.join('welcome', 'welcome.html.ejs'), data));
    expect(result.subject).to.eql(renderEjs(path.join('welcome', 'welcome.subject.ejs'), data));
  }));
});
