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

  get serverVersion() {
    return this._serverInfo.version;
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

  * connect() {
    const opts = _.merge({
      promiseLibrary: Promise
    }, this._mongoCfg.options);
    const db = yield MongoClient.connect(this._mongoCfg.url, opts);
    const serverInfo = yield db.admin().serverInfo();
    this._serverInfo = serverInfo;
    logger.info(_.pick(serverInfo, 'version'), `Mongo connection established: ${this._mongoCfg.url}`);
    this._db = db;
    return this;
  }
}

module.exports = Mongo;
