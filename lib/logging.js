'use strict';

const config = require('config');
const bunyan = require('bunyan');
const loggingCfg = config.get('logging');
const path = require('path');

const rootCfg = { name: loggingCfg.name, streams: [] };

if (loggingCfg.stdout.enabled) {
  rootCfg.streams.push({ stream: process.stdout, level: loggingCfg.stdout.level || 'debug' });
}

if (loggingCfg.file.enabled) {
  const appRoot = path.join(__dirname, '../');
  rootCfg.streams.push({ path: path.join(appRoot, loggingCfg.file.path), level: loggingCfg.file.level || 'debug' });
}

const rootLogger = bunyan.createLogger(rootCfg);

module.exports = {
  getLogger: function () {
    return rootLogger;
  }
};
