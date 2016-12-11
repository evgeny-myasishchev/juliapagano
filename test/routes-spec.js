const _ = require('lodash');
const boot = require('../app/boot');
const chai = require('chai');
const chance = require('./mocks/chance');
const co = require('co');
const config = require('config');
const db = require('../app/lib/db');
const emailProvider = require('../app/lib/emailProvider');
const express = require('express');
const expressSpy = require('./support/express-spy');
const pages = require('../app/lib/pages');
const request = require('supertest-as-promised');
const router = require('../app/routes');
const sinon = require('sinon');
const Page = require('../app/models/Page');

const expect = chai.expect;

describe('routes', () => {
  global.loggingHookup();

  let app;
  before(() => {
    app = express();
    app.use(expressSpy.create());
    boot.newApp()
      .withLogging()
      .withRoutes(router)
      .withViewEngine()
      .start(app);
  });

  before(() => co(() => db.connect()));
  after(() => co(() => db.close()));

  const sandbox = sinon.sandbox.create();

  beforeEach(() => {
    expressSpy.stubRes = false;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('dynamic pages', () => {
    let pageDoc;
    let collection;
    beforeEach(co.wrap(function* () {
      expressSpy.stubRes = true;
      pageDoc = chance.page();

      collection = db.collection('pages');
      yield collection.drop().catch({ code: 26 }, _.noop);
      yield collection.insert(pageDoc);

      sandbox.spy(Page, 'get');
      sandbox.stub(Page.prototype, 'preloadPhotosets').resolves();
    }));

    it('should get page from db, prelod photosets and render it', co.wrap(function* () {
      yield request(app).get(`/${pageDoc._id}`).expect(200);
      expect(Page.get).to.have.been.calledWith(pageDoc._id);
      expect(Page.prototype.preloadPhotosets).to.have.callCount(1);
      const page = new Page(pageDoc);
      expect(expressSpy.last.res.render).to.have.been.calledWith(`pages/${page.id}`, sinon.match({ currentPage: page }));
    }));

    it('render home page for root', co.wrap(function* () {
      const homeDoc = chance.page({ _id: 'home' });
      yield collection.insert(homeDoc);

      yield request(app).get('/').expect(200);
      expect(Page.get).to.have.been.calledWith(homeDoc._id);
      expect(Page.prototype.preloadPhotosets).to.have.callCount(1);
      const page = new Page(homeDoc);
      expect(expressSpy.last.res.render).to.have.been.calledWith(`pages/${page.id}`, sinon.match({ currentPage: page }));
    }));

    it('should respond with 404 if no page found',
      () => request(app).get(`/${pageDoc._id}-not-existing`).expect(404)
    );
  });

  describe('GET /contacts', () => {
    it('should render contacts page', () => request(app).get('/contacts').expect(200)
        .then(() => {
          expect(expressSpy.last.res.render).to.have.been.calledWith('pages/contacts', sinon.match({ currentPage: pages.contacts }));
        }));
  });

  describe('POST /contacts', () => {
    let sendEmailStub;
    let payload;
    beforeEach(() => {
      payload = chance.contactsRequestPayload();
      sendEmailStub = sandbox.stub(emailProvider, 'sendEmail').resolves({});
    });

    it('should send contacts and thanks emails', co.wrap(function* () {
      yield request(app).post('/contacts').send(payload).expect(200);
      expect(sendEmailStub).to.have.callCount(2);
      expect(sendEmailStub).to.have.been.calledWith(sinon.match({
        from: payload.email,
        to: config.get('contacts.sendTo'),
        template: sinon.match((template) => {
          expect(template.path).to.eql('contacts');
          expect(template.data).to.eql(payload);
          return true;
        }),
      }));
      expect(sendEmailStub).to.have.been.calledWith(sinon.match({
        from: config.get('contacts.sendTo'),
        to: payload.email,
        template: sinon.match((template) => {
          expect(template.path).to.eql('contactsThanks');
          expect(template.data).to.eql(payload);
          return true;
        }),
      }));
    }));

    it('should respond with 400 error if body schema validation fails', () => {
      delete payload.name;
      delete payload.email;
      return request(app).post('/contacts').send(payload).expect(400, /required property 'name'/);
    });
  });
});
