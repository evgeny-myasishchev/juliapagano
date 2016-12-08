const Promise = require('bluebird');
const flickrClient = require('../lib/flickrClient');
const _ = require('lodash');

function getPhotos(photosetId) {
  return flickrClient.photosetsGetPhotos(photosetId)
    .then((res) => {
      const photoset = res.photoset;
      return Promise.map(photoset.photo,
        photo => flickrClient.photosGetSizes(photo.id)
          .then(result => ({
            id: photo.id,
            title: photo.title,
            sizes: _.keyBy(result.sizes.size, s => s.label),
          }))
      )
      .then(photos => ({ galleryTitle: photoset.title, items: photos }));
    });
}

module.exports = {
  getPhotos,
};
