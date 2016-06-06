'use strict';

const Promise = require('bluebird');
const request = require('request');
const moduleCfg = require('config').get('flickrClient');
const _ = require('lodash');

const API_URL = 'https://api.flickr.com/services/rest';

function callApi(options) {
  return new Promise(function (resolve, reject) {
      const opts = _.merge({
        qs: {
          api_key: moduleCfg.apiKey, //jshint ignore:line
          user_id: moduleCfg.userId, //jshint ignore:line
          format: 'json',
          nojsoncallback: 1
        }
      }, options);
      request(opts, function (err, resp, body) {
          if (err) return reject(err);
          let data = JSON.parse(body);
          if (data.stat === 'fail') {
            return reject(new Error('Request failed: ' + body));
          }

          return resolve(data);
        });
    });
}

function photosetsGetPhotos(photosetId) {
  return callApi({
      url: API_URL,
      method: 'GET',
      qs: {
          method: 'flickr.photosets.getPhotos',
          photoset_id: photosetId //jshint ignore:line
        }
    });
}

function photosGetSizes(photoId) {
  return callApi({
      url: API_URL,
      method: 'GET',
      qs: {
          method: 'flickr.photos.getSizes',
          photo_id: photoId //jshint ignore:line
        }
    });
}

module.exports = {
  photosetsGetPhotos: photosetsGetPhotos,
  photosGetSizes: photosGetSizes
};
