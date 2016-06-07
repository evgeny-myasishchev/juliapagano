'use strict';

const nock = require('nock');
const config = require('config');
const flickrClientCfg = config.get('flickrClient');
const flickrClient = require('../app/lib/flickrClient');
const chai = require('chai');
const expect = chai.expect;

describe('flickrClient', function () {
  const timestamp = new Date().getTime();

  const failureResponse = {
    stat: 'fail',
    code: timestamp,
    message: 'Failure message ' + timestamp
  };

  describe('photosetsGetPhotos', function () {
    const getPhotosResponse = require('./mocks/flickrPhotosetsGetPhotos');
    const photosetId = 'photoset-id-' + timestamp;
    it('should GET flickr.photosets.getPhotos', function (done) {
      const apiCall = nock('https://api.flickr.com')
        .get('/services/rest')
        .query({
          method: 'flickr.photosets.getPhotos',
          photoset_id: photosetId, //jshint ignore:line
          api_key: flickrClientCfg.apiKey, //jshint ignore:line
          user_id: flickrClientCfg.userId, //jshint ignore:line
          format: 'json',
          nojsoncallback: 1
        })
        .reply(200, getPhotosResponse);
      flickrClient.photosetsGetPhotos(photosetId)
        .then(function (data) {
          apiCall.done();
          expect(data).to.eql(getPhotosResponse);
          done();
        })
        .catch(done);
    });

    it('should handle failure response', function (done) {
      const apiCall = nock('https://api.flickr.com')
        .get('/services/rest')
        .query(() => true)
        .reply(200, failureResponse);
      flickrClient.photosetsGetPhotos(photosetId)
        .then(function () {
          done(new Error('Failure response not handled.'));
        })
        .catch(function (err) {
          apiCall.done();
          expect(err.message).to.eql('Request failed: ' + JSON.stringify(failureResponse));
          done();
        })
        .catch(done);
    });
  });

  describe('photosGetSizes', function () {
    const photoId = 'photo-id-' + timestamp;
    const getSizesResponse = require('./mocks/flickrPhotosGetSizes').create('fake-user-100', photoId);
    it('should GET flickr.photos.getSizes', function (done) {
      const apiCall = nock('https://api.flickr.com')
        .get('/services/rest')
        .query({
          method: 'flickr.photos.getSizes',
          photo_id: photoId, //jshint ignore:line
          api_key: flickrClientCfg.apiKey, //jshint ignore:line
          user_id: flickrClientCfg.userId, //jshint ignore:line
          format: 'json',
          nojsoncallback: 1
        })
        .reply(200, getSizesResponse);
      flickrClient.photosGetSizes(photoId)
        .then(function (data) {
          apiCall.done();
          expect(data).to.eql(getSizesResponse);
          done();
        })
        .catch(done);
    });

    it('should handle failure response', function (done) {
      const apiCall = nock('https://api.flickr.com')
        .get('/services/rest')
        .query(() => true)
        .reply(200, failureResponse);
      flickrClient.photosGetSizes(photoId)
        .then(function () {
          done(new Error('Failure response not handled.'));
        })
        .catch(function (err) {
          apiCall.done();
          expect(err.message).to.eql('Request failed: ' + JSON.stringify(failureResponse));
          done();
        })
        .catch(done);
    });
  });
});
