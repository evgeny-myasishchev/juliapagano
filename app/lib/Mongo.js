'use strict';

const _ = require('lodash');
const config = require('config');
const logger = require('../logging').getLogger('MONGO');
const mongodb = require('mongodb');
const Promise = require('bluebird');

const MongoClient = mongodb.MongoClient;

const driverLogger = logger.child({ driver: 'mongodb ' });
mongodb.Logger.setLevel(config.get('mongo.log.level'));
mongodb.Logger.setCurrentLogger(function (msg, evt) {
  driverLogger.debug(evt.message);
});

class Mongo {
  constructor(mongoCfg) {
    this._mongoCfg = mongoCfg || config.get('mongo');
    this._db = null;
    this._collections = {};
  }

  collection(name) {
    return this._collections[name] || (this._collections[name] = this._db.collection(name));
  }

  close() {
    if (this._db) {
      return this._db.close(false).then(() => {
        this._db = null;
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
      const opts = _.merge({
        promiseLibrary: Promise
      }, self._mongoCfg.options);
      MongoClient.connect(self._mongoCfg.url, opts, (err, db) => {
        if (err) return reject(err);
        logger.info(`Mongo connection established: ${self._mongoCfg.url}`);
        self._db = db;
        return resolve(self);
      });
    });
  }
}

module.exports = Mongo;
