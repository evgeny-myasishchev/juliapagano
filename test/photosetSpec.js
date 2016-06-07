'use strict';

const photoset = require('../app/models/photoset');
const flickrClient = require('../app/lib/flickrClient');
const sinon = require('sinon');
const Promise = require('bluebird');
const chai = require('chai');
const expect = chai.expect;

const getPhotosResult = require('./mocks/flickrPhotosetsGetPhotos');
const flickrPhotosGetSizes = require('./mocks/flickrPhotosGetSizes');

describe('photoset', function () {
  var sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(flickrClient, 'photosetsGetPhotos', function (photosetId) {
      expect(getPhotosResult.photoset.id).to.eql(photosetId);
      return Promise.resolve(getPhotosResult);
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getPhotos', function () {
    it('should use flickr client to get photos and photo sizes and return the result', function (done) {
      const photo1 = getPhotosResult.photoset.photo[0];
      const photo2 = getPhotosResult.photoset.photo[1];
      const photo3 = getPhotosResult.photoset.photo[2];
      const size1 = flickrPhotosGetSizes.create('u-100', photo1);
      const size2 = flickrPhotosGetSizes.create('u-100', photo2);
      const size3 = flickrPhotosGetSizes.create('u-100', photo3);
      sandbox.stub(flickrClient, 'photosGetSizes', function (photoId) {
        if (photoId === photo1.id) return Promise.resolve(size1);
        if (photoId === photo2.id) return Promise.resolve(size2);
        if (photoId === photo3.id) return Promise.resolve(size3);
        return Promise.reject(new Error('Unexpected photoId: ' + photoId));
      });

      photoset.getPhotos(getPhotosResult.photoset.id)
        .then(function (photos) {
          expect(photos.galleryTitle).to.eql(getPhotosResult.photoset.title);
          expect(photos.items.length).to.eql(3);

          const item1 = photos.items[0];
          expect(item1.id).to.eql(photo1.id);
          expect(item1.title).to.eql(photo1.title);
          size1.sizes.size.forEach(function (size) {
            expect(item1.sizes[size.label]).to.eql(size);
          });

          const item2 = photos.items[1];
          expect(item2.id).to.eql(photo2.id);
          expect(item2.title).to.eql(photo2.title);
          size2.sizes.size.forEach(function (size) {
            expect(item2.sizes[size.label]).to.eql(size);
          });

          const item3 = photos.items[2];
          expect(item3.id).to.eql(photo3.id);
          expect(item3.title).to.eql(photo3.title);
          size3.sizes.size.forEach(function (size) {
            expect(item3.sizes[size.label]).to.eql(size);
          });
        })
        .then(done)
        .catch(done);
    });
  });
});
