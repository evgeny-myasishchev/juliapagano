const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const logger = require('../logging').getLogger('MONGO');

class Collection {
  constructor(mongoCol) {
    this._col = mongoCol;
  }

  bulkWrite(operations) {
    //TODO: Options
    return this._col.bulkWrite(operations);
  }
}

class Mongo {
  constructor(mongoCfg) {
    this._mongoCfg = mongoCfg || (require('config')).get('mongo');
    this._db = null;
    this._collections = {};
  }

  collection(name) {
    return this._collections[name] || (this._collections[name] = new Collection(this._db.collection(name)));
  }

  close() {
    if (this._db) {
      return this._db.close(false).then(() => {
        logger.info('Connection closed');
      });
    } else {
      logger.info('No active connection to close');
      return Promise.resolve();
    }
  }

  connect() {
    const self = this;
    return new Promise((resolve, reject) => {
      MongoClient.connect(self._mongoCfg.url, self._mongoCfg.options, (err, db) => {
        if (err) return reject(err);
        logger.info(`Mongo connection established: ${self._mongoCfg.url}`);
        self._db = db;
        return resolve(self);
      });
    });
  }
}

module.exports = Mongo;
