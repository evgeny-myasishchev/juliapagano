const _ = require('lodash');
const co = require('co');
const config = require('config');
const express = require('express');

const chai = require('chai');
const request = require('supertest-as-promised');
const sinon = require('sinon');

const Page = require('../../app/models/Page');
const boot = require('../../app/boot');
const chance = require('./../mocks/chance');
const db = require('../../app/lib/db');
const emailProvider = require('../../app/lib/emailProvider');
const expressSpy = require('./../support/express-spy');
const pages = require('../../app/lib/pages');
const router = require('../../app/controllers/content');

const expect = chai.expect;

describe('controller/content', () => {
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
  let collection;

  beforeEach(function* () {
    expressSpy.stubRes = false;
    collection = db.collection('pages');
    yield collection.drop().catch({ code: 26 }, _.noop);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('dynamic pages', () => {
    let pageDoc;
    beforeEach(co.wrap(function* () {
      expressSpy.stubRes = true;
      pageDoc = chance.page();

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

    it('not attempt to render nested pages', co.wrap(function* () {
      yield request(app).get(`/${chance.word()}/${chance.word()}`).expect(404);
      expect(Page.get).to.have.callCount(0);
      expect(expressSpy.last.res.render).to.have.callCount(0);
    }));
  });

  describe('GET /special-offers', () => {
    beforeEach(() => {
      sandbox.spy(Page, 'getBySection');
      sandbox.stub(Page.prototype, 'preloadPhotosets').resolves();
    });

    it('should get special offers and render them', function* () {
      const page1 = chance.specialOfferPage();
      const page2 = chance.specialOfferPage();
      const page3 = chance.specialOfferPage();
      const all = [page1, page2, page3];
      yield collection.insert(all);
      yield request(app).get('/special-offers').expect(200);
      expect(expressSpy.last.res.render).to.have.been.calledWith('pages/special-offers', sinon.match({
        currentPage: pages['special-offers'],
        specialOffers: all.map(offer => new Page(offer)),
      }));
      expect(Page.getBySection).to.have.been.calledWith('special-offers');
      expect(Page.prototype.preloadPhotosets).to.have.callCount(3);
    });
  });

  describe('GET /special-offers/*', () => {
    beforeEach(() => {
      sandbox.spy(Page, 'get');
      sandbox.stub(Page.prototype, 'preloadPhotosets').resolves();
    });

    it('should render special particular special offer', function* () {
      const page1 = chance.specialOfferPage();
      yield collection.insert(page1);
      yield request(app).get(`/${page1._id}`).expect(200);
      expect(expressSpy.last.res.render).to.have.been.calledWith('pages/special-offer', sinon.match({
        parentPage: pages['special-offers'],
        currentPage: new Page(page1),
      }));
      expect(Page.get).to.have.been.calledWith(page1._id);
      expect(Page.prototype.preloadPhotosets).to.have.callCount(1);
    });
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
