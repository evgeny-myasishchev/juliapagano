'use strict';

const Promise = require('bluebird');

function getPhotos(photosetId) {
  return Promise.reject('Not implemented. PhotosetId: ' + photosetId);
}

module.exports = {
  getPhotos: getPhotos
};
