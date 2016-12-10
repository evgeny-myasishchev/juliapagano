const _ = require('lodash');
const db = require('../lib/db');
const errors = require('../lib/errors');
const logging = require('../logging');

const logger = logging.getLogger();

class Page {
  constructor(data) {
    this._data = _.cloneDeep(data);
  }

  get data() {
    return _.cloneDeep(this._data);
  }

  //
  // //Name that is shown in a nav menu as well as on the title bar
  // get name() {
  //
  // }
  //
  // //Title that is shown on the page
  // get title() {
  //
  // }
  //
  static* get(id) {
    const pageData = yield db.collection('pages').findOne({ _id: id });
    if (!pageData) {
      logger.info(`Page data not found id=${id}`);
      throw new errors.ResourceNotFound(`Page ${id} not found`);
    }
    logger.info(`Got page data from db id=${id}`);
    return new Page(pageData);
  }
  //
  // static create(data) {
  //
  // }
}

module.exports = Page;
