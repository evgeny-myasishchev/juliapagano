'use strict';

const boot = require('../app/boot');
const router = require('../app/routes');
const request = require('supertest');
const express = require('express');
const expressSpy = require('./support/express-spy');
const chai = require('chai');
const expect = chai.expect;
const pages = require('../app/lib/pages');
const sinon = require('sinon');
const photoset = require('../app/models/photoset');
const Promise = require('bluebird');

chai.use(require('sinon-chai'));

describe('routes', function () {
  const timestamp = new Date().getTime();
  let app;
  before(() => {
    app = express();
    app.use(expressSpy);
    boot.newApp()
      .withLogging()
      .withRoutes(router)
      .withViewEngine()
      .start(app);
  });

  var sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /', function () {

    const dummyPhotoset = [
      { photo1: timestamp + 100 },
      { photo2: timestamp + 110 }
    ];
    beforeEach(() => {
      sandbox.stub(photoset, 'getPhotos', function (photosetId) {
        expect(photosetId).to.eql(pages.home.carousel.photosetId);
        return Promise.resolve(dummyPhotoset);
      });
    });

    it('should render home page with data', function (done) {
      request(app).get('/').expect(200, function () {
        expect(photoset.getPhotos).to.have.been.calledWith(pages.home.carousel.photosetId);
        expect(expressSpy.last.res.render).to.have.been.calledWith('pages/home',
          sinon.match({ currentPage: pages.home, carouselPhotoset: dummyPhotoset }));
        done();
      });
    });

    it('should respond with error if failed to get photoset', function (done) {
      photoset.getPhotos.restore();
      sandbox.stub(photoset, 'getPhotos', () => Promise.reject('Unexpected error'));
      request(app).get('/').expect(500, done);
    });
  });

  describe('GET /about', function () {
    const dummySelfiePhotoset = {
      items: [
        { photo1: timestamp + 100, sizes: { Medium: { source: 'fake' } } },
        { photo2: timestamp + 110 }
      ]
    };
    beforeEach(() => {
      sandbox.stub(photoset, 'getPhotos', function (photosetId) {
        expect(photosetId).to.eql(pages.about.selfie.photosetId);
        return Promise.resolve(dummySelfiePhotoset);
      });
    });

    it('should render about page', function (done) {
      request(app).get('/about')
        .expect(200)
        .expect(function () {
          expect(expressSpy.last.res.render).to.have.been.calledWith('pages/about', sinon.match({
            currentPage: pages.about,
            selfie: dummySelfiePhotoset.items[0]
          }));
        })
        .end(done);
    });
  });

  describe('GET /portfolio', function () {
    const dummyPhotoset = [
      { photo1: timestamp + 100 },
      { photo2: timestamp + 110 }
    ];
    beforeEach(() => {
      sandbox.stub(photoset, 'getPhotos', function (photosetId) {
        expect(photosetId).to.eql(pages.portfolio.gallery.photosetId);
        return Promise.resolve(dummyPhotoset);
      });
    });

    it('should render portfolio page with portfolio photoset', function (done) {
      request(app).get('/portfolio').expect(200, function () {
        expect(expressSpy.last.res.render).to.have.been.calledWith('pages/portfolio', sinon.match({
          currentPage: pages.portfolio,
          galleryPhotoset: dummyPhotoset
        }));
        done();
      });
    });
  });

  describe('GET /kind-words', function () {
    it('should render kind-words page', function (done) {
      request(app).get('/kind-words').expect(200, function () {
        expect(expressSpy.last.res.render).to.have.been.calledWith('pages/kind-words', sinon.match({ currentPage: pages['kind-words'] }));
        done();
      });
    });
  });

  describe('GET /info-and-prices', function () {
    it('should render info-and-prices page', function (done) {
      request(app).get('/info-and-prices').expect(200, function () {
        expect(expressSpy.last.res.render).to.have.been.calledWith('pages/info-and-prices', sinon.match({ currentPage: pages['info-and-prices'] }));
        done();
      });
    });
  });

  describe('GET /contacts', function () {
    it('should render contacts page', function (done) {
      request(app).get('/contacts').expect(200, function () {
        expect(expressSpy.last.res.render).to.have.been.calledWith('pages/contacts', sinon.match({ currentPage: pages.contacts }));
        done();
      });
    });
  });
});
