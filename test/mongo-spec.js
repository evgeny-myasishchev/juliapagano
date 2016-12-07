'use strict';

const _ = require('lodash');
const chai = require('chai');
const chance = require('./mocks/chance');
const co = require('co');
const Mongo = require('../app/lib/Mongo');
const Promise = require('bluebird');

const expect = chai.expect;

describe('Mongo', () => {
  global.loggingHookup();

  let mongo = new Mongo();
  before(() => co(() => mongo.connect()));
  after(() => mongo.close());

  describe('collection', () => {
    let collection;

    beforeEach(() => {
      collection = mongo.collection('mongo-test');
      return collection.drop()
        .catch({ code: 26 }, _.noop)
        .catch(function (err) {
          console.log(`Failed to drop collection. Server version: ${mongo.serverVersion}`);
          console.log(err);
          return Promise.reject(err);
        });
    });

    describe('generic', () => {
      it('should insert new documents', co.wrap(function * () {
        const page1 = chance.page();
        const page2 = chance.page();
        yield collection.insertMany([page1, page2]);
        const all = yield collection.find().toArray();
        expect(all.length).to.eql(2);
        expect(all).to.contain(page1);
        expect(all).to.contain(page2);
      }));

      it('should throw error on duplicate id', co.wrap(function * () {
        const page1 = chance.page();
        yield collection.insert(page1);
        let errorRaised = false;
        yield collection.insert(page1).catch({ code: 11000 }, function (err) {
          errorRaised = true;
          expect(err.message).to.contain(page1._id);
        });

        expect(errorRaised).to.eql(true);
        expect((yield collection.count())).to.eql(1);
      }));
    });
  });
});
