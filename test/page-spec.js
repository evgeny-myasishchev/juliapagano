const _ = require('lodash');
const chai = require('chai');
const chance = require('./mocks/chance');
const co = require('co');
const db = require('../app/lib/db');
const errors = require('../app/lib/errors');
const Page = require('../app/models/Page');

const expect = chai.expect;

describe('Page', () => {
  before(() => co(() => db.connect()));
  after(() => db.close());

  describe('get', () => {
    let pageDoc;
    beforeEach(co.wrap(function* () {
      pageDoc = chance.page();

      const collection = db.collection('pages');
      yield collection.drop().catch({ code: 26 }, _.noop);
      yield collection.insert(pageDoc);
    }));

    it('should read the page from the db', co.wrap(function* () {
      const page = yield Page.get(pageDoc._id);
      expect(page.data).to.eql(pageDoc);
    }));

    it('should respond with ResourceNotFound error', co.wrap(function* () {
      const unknownId = `not-existing-${chance.word()}`;
      let error;
      try {
        yield Page.get(unknownId);
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an.instanceof(errors.ResourceNotFound);
      expect(error.message).to.eql(`Page ${unknownId} not found`);
    }));
  });
});
