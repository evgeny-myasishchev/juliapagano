const chai = require('chai');
const config = require('config');
const flickrClient = require('../app/lib/flickrClient');
const flickrPhotosGetSizes = require('./mocks/flickrPhotosGetSizes');
const getPhotosResponse = require('./mocks/flickrPhotosetsGetPhotos');
const nock = require('nock');

const expect = chai.expect;
const flickrClientCfg = config.get('flickrClient');

describe('flickrClient', () => {
  const timestamp = new Date().getTime();

  const failureResponse = {
    stat: 'fail',
    code: timestamp,
    message: `Failure message ${timestamp}`,
  };

  describe('photosetsGetPhotos', () => {
    const photosetId = `photoset-id-${timestamp}`;
    it('should GET flickr.photosets.getPhotos', (done) => {
      const apiCall = nock('https://api.flickr.com')
        .get('/services/rest')
        .query({
          method: 'flickr.photosets.getPhotos',
          photoset_id: photosetId, // jshint ignore:line
          api_key: flickrClientCfg.apiKey, // jshint ignore:line
          user_id: flickrClientCfg.userId, // jshint ignore:line
          format: 'json',
          nojsoncallback: 1,
        })
        .reply(200, getPhotosResponse);
      flickrClient.photosetsGetPhotos(photosetId)
        .then((data) => {
          apiCall.done();
          expect(data).to.eql(getPhotosResponse);
          done();
        })
        .catch(done);
    });

    it('should handle failure response', (done) => {
      const apiCall = nock('https://api.flickr.com')
        .get('/services/rest')
        .query(() => true)
        .reply(200, failureResponse);
      flickrClient.photosetsGetPhotos(photosetId)
        .then(() => {
          done(new Error('Failure response not handled.'));
        })
        .catch((err) => {
          apiCall.done();
          expect(err.message).to.eql(`Request failed: ${JSON.stringify(failureResponse)}`);
          done();
        })
        .catch(done);
    });
  });

  describe('photosGetSizes', () => {
    const photoId = `photo-id-${timestamp}`;
    const getSizesResponse = flickrPhotosGetSizes.create('fake-user-100', photoId);
    it('should GET flickr.photos.getSizes', (done) => {
      const apiCall = nock('https://api.flickr.com')
        .get('/services/rest')
        .query({
          method: 'flickr.photos.getSizes',
          photo_id: photoId, // jshint ignore:line
          api_key: flickrClientCfg.apiKey, // jshint ignore:line
          user_id: flickrClientCfg.userId, // jshint ignore:line
          format: 'json',
          nojsoncallback: 1,
        })
        .reply(200, getSizesResponse);
      flickrClient.photosGetSizes(photoId)
        .then((data) => {
          apiCall.done();
          expect(data).to.eql(getSizesResponse);
          done();
        })
        .catch(done);
    });

    it('should handle failure response', (done) => {
      const apiCall = nock('https://api.flickr.com')
        .get('/services/rest')
        .query(() => true)
        .reply(200, failureResponse);
      flickrClient.photosGetSizes(photoId)
        .then(() => {
          done(new Error('Failure response not handled.'));
        })
        .catch((err) => {
          apiCall.done();
          expect(err.message).to.eql(`Request failed: ${JSON.stringify(failureResponse)}`);
          done();
        })
        .catch(done);
    });
  });
});
