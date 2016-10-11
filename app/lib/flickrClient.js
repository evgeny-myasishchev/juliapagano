'use strict';

const _ = require('lodash');
const cache = require('./cache');
const moduleCfg = require('config').get('flickrClient');
const Promise = require('bluebird');
const request = require('request');
const logger = require('../logging').getLogger();

const API_URL = 'https://api.flickr.com/services/rest';

function callApi(options) {
  if (!moduleCfg.apiKey) throw new Error('Flickr api key not configured');
  if (!moduleCfg.userId) throw new Error('Flickr user id not configured');

  const cacheKey = _.values(_.get(options, 'qs')).join('-');
  if (moduleCfg.cache && cache.has(cacheKey)) {
    logger.info({ cacheKey, qs: options.qs }, `Flickr cache entry found`);
    return Promise.resolve(cache.get(cacheKey));
  }

  logger.debug(options.qs, 'Making flickr api call');

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
            logger.info({ qs: options.qs, data }, 'Call failed');
            return reject(new Error('Request failed: ' + body));
          }

          if (moduleCfg.cache) {
            logger.debug({ cacheKey, qs: options.qs }, 'Caching flickr response');
            cache.set(cacheKey, data);
          }

          logger.debug(options.qs, 'Flickr api call completed');
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
