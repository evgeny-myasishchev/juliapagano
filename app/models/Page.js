const _ = require('lodash');
const co = require('co');
const db = require('../lib/db');
const errors = require('../lib/errors');
const logging = require('../logging');
const photoset = require('./photoset');
const Promise = require('bluebird');

const logger = logging.getLogger();

class Page {
  constructor(data) {
    this._data = _.cloneDeep(data);
  }

  get id() {
    return this._data._id;
  }

  get data() {
    return _.cloneDeep(this._data);
  }

  get blocks() {
    return this._data.blocks;
  }

  preloadPhotosets() {
    logger.info(`Preloading photosets for page: ${this.id}`);
    return Promise.map(this.blocks, co.wrap(function* (block, index) {
      if (_.has(block, 'flickr.photosetId')) {
        const photosetId = block.flickr.photosetId;
        logger.debug({ photosetId, blockIndex: index }, 'Flickr photoset found. Preloading');
        _.set(block, 'flickr.photoset', yield photoset.getPhotos(photosetId));
      }
    }));
  }

  static* get(id) {
    const pageData = yield db.collection('pages').findOne({ _id: id });
    if (!pageData) {
      logger.info(`Page data not found id=${id}`);
      throw new errors.ResourceNotFound(`Page ${id} not found`);
    }
    logger.info(`Got page data from db id=${id}`);
    return new Page(pageData);
  }
}

module.exports = Page;
