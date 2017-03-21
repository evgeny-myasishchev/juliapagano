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

  let collection;

  beforeEach(function* () {
    collection = db.collection('pages');
    yield collection.drop().catch({ code: 26 }, _.noop);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('blocks', () => {
    it('should define blocks accessor', () => {
      const pageDoc = chance.page();
      const page = new Page(pageDoc);
      expect(page.blocks()).to.eql(pageDoc.blocks);
    });

    it('should return filtered blocks', () => {
      const filterVal = `filter-val-${chance.word()}`;
      const pageDoc = chance.page();
      let block1;
      let block2;
      pageDoc.blocks.push(block1 = chance.blockWithPhotoset({ filterVal }));
      pageDoc.blocks.push(block2 = chance.blockWithPhotoset({ filterVal }));
      const page = new Page(pageDoc);
      expect(page.blocks({ filterVal })).to.eql([block1, block2]);
    });
  });

  describe('get', () => {
    let pageDoc;
    beforeEach(co.wrap(function* () {
      pageDoc = chance.page();
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

  describe('getAll', () => {
    it('return all pages', function* () {
      const page11 = chance.page();
      const page12 = chance.page();
      const page21 = chance.page();
      const page22 = chance.page();

      yield collection.insert([page11, page12, page21, page22]);
      const allPages = yield Page.getAll();
      expect(allPages).to.eql(_.sortBy([page11, page12, page21, page22].map(p => new Page(p)), p => p.data.order));
    });
  });

  describe('getBySection', () => {
    it('should return pages found by given section', function* () {
      const section1 = `section-${chance.word()}`;
      const section2 = `section-${chance.word()}`;

      const page11 = chance.page({ section: section1 });
      const page12 = chance.page({ section: section1 });
      const page21 = chance.page({ section: section2 });
      const page22 = chance.page({ section: section2 });

      yield collection.insert([page11, page12, page21, page22]);

      const sect1Pages = yield Page.getBySection(section1);
      expect(sect1Pages).to.eql([page11, page12].map(p => new Page(p)));

      const sect2Pages = yield Page.getBySection(section2);
      expect(sect2Pages).to.eql([page21, page22].map(p => new Page(p)));
    });

    it('should sort found pages by order', function* () {
      const section1 = `section-${chance.word()}`;

      const page2 = chance.page({ title: 'Page 2', order: 2, section: section1 });
      const page1 = chance.page({ title: 'Page 1', order: 1, section: section1 });

      yield collection.insert([page2, page1]);

      const pages = yield Page.getBySection(section1);
      expect(pages[0].data).to.eql(page1);
      expect(pages[1].data).to.eql(page2);
    });
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
      const ps1Block = _.find(page.blocks(), { id: ps1.id });
      expect(ps1Block.flickr.photoset).to.eql(ps1Photos);
      const ps2Block = _.find(page.blocks(), { id: ps2.id });
      expect(ps2Block.flickr.photoset).to.eql(ps2Photos);
      expect(getPhotosStub).to.have.callCount(2);
      expect(getPhotosStub).to.have.been.calledWith(ps1.flickr.photosetId);
      expect(getPhotosStub).to.have.been.calledWith(ps2.flickr.photosetId);
    }));
  });
});
