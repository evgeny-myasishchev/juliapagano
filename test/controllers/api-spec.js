const _ = require('lodash');
const co = require('co');
const express = require('express');

const chai = require('chai');
const request = require('supertest-as-promised');

const boot = require('../../app/boot');
const chance = require('./../mocks/chance');
const db = require('../../app/lib/db');
const expressSpy = require('./../support/express-spy');
const router = require('../../app/controllers/api');

const expect = chai.expect;

describe('controller/api', () => {
  global.loggingHookup();

  let app;
  let pagesCollection;
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

  beforeEach(function* () {
    expressSpy.stubRes = false;
    pagesCollection = db.collection('pages');
    yield pagesCollection.drop().catch({ code: 26 }, _.noop);
  });

  describe('GET /api/v1/pages', () => {
    it('should all pages from db and render them', function* () {
      const page11 = chance.page();
      const page12 = chance.page();
      const page21 = chance.page();
      const page22 = chance.page();

      yield pagesCollection.insert([page11, page12, page21, page22]);

      yield request(app).get('/api/v1/pages').expect(200).then((res) => {
        expect(res.body).to.have.all.keys('resources');
        expect(res.body.resources).to.eql(_.sortBy([page11, page12, page21, page22], p => p.order));
      });
    });
  });
});
