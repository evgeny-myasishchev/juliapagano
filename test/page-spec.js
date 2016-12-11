const _ = require('lodash');
const chai = require('chai');
const chance = require('./mocks/chance');
const co = require('co');
const db = require('../app/lib/db');
const errors = require('../app/lib/errors');
const Page = require('../app/models/Page');
const photoset = require('../app/models/photoset');
const sinon = require('sinon');

const expect = chai.expect;

describe('Page', () => {
  global.loggingHookup();

  const sandbox = sinon.sandbox.create();

  before(() => co(() => db.connect()));
  after(() => co(() => db.close()));
  afterEach(() => {
    sandbox.restore();
  });

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

  describe('preloadPhotosets', () => {
    let pageDoc;
    let page;
    let ps1;
    let ps1Photos;
    let ps2;
    let ps2Photos;
    let getPhotosStub;

    beforeEach(() => {
      pageDoc = chance.page();
      pageDoc.blocks.push(ps1 = chance.blockWithPhotoset());
      pageDoc.blocks.push(ps2 = chance.blockWithPhotoset());
      page = new Page(pageDoc);

      ps1Photos = { dummy: `photo-of-ps1-${chance.word()}` };
      ps2Photos = { dummy: `photo-of-ps2-${chance.word()}` };

      getPhotosStub = sandbox.stub(photoset, 'getPhotos', (psId) => {
        if (psId === ps1.flickr.photosetId) {
          return Promise.resolve(ps1Photos);
        }
        if (psId === ps2.flickr.photosetId) {
          return Promise.resolve(ps2Photos);
        }
        return Promise.reject(new Error(`Photoset not found ${psId}`));
      });
    });

    it('should preload all flickr photosets for given page', co.wrap(function* () {
      yield page.preloadPhotosets();
      const ps1Block = _.find(page.blocks, { id: ps1.id });
      expect(ps1Block.flickr.photoset).to.eql(ps1Photos);
      const ps2Block = _.find(page.blocks, { id: ps2.id });
      expect(ps2Block.flickr.photoset).to.eql(ps2Photos);
      expect(getPhotosStub).to.have.callCount(2);
      expect(getPhotosStub).to.have.been.calledWith(ps1.flickr.photosetId);
      expect(getPhotosStub).to.have.been.calledWith(ps2.flickr.photosetId);
    }));
  });
});
