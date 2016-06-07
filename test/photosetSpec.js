'use strict';

const photoset = require('../app/models/photoset');

describe('photoset', function () {
  const timestamp = new Date().getTime();

  describe('getPhotos', function () {
    const getPhotosResult = {
      photoset: {
        title: 'Photoset ' + timestamp,
        photo: [
          
        ]
      }
    }
    it('should use flickr client to get photos and photo sizes and return the result', function () {

    });
  });
});
