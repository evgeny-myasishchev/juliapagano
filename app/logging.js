const _ = require('lodash');
const bunyan = require('bunyan');
const config = require('config');
const path = require('path');

const loggingCfg = config.get('logging');

const rootCfg = { name: loggingCfg.name, streams: [] };

if (loggingCfg.stdout.enabled) {
  if (loggingCfg.stdout.filterAssets) {
    // TODO: Extend bunyan with filtering support
    // TODO: Integrate continuations to support requests logging
    rootCfg.streams.push({
      type: 'raw',
      stream: {
        write(data) {
          const url = _.get(data, 'req.url');
          if (url && url.startsWith('/assets')) return;
          if (_.get(data, 'res.statusCode') === 304) return; // asset responses are very often 304

          process.stdout.write(JSON.stringify(data));
          process.stdout.write('\n');
        },
      },
      level: loggingCfg.stdout.level || 'debug',
    });
  } else {
    rootCfg.streams.push({
      stream: process.stdout,
      level: loggingCfg.stdout.level || 'debug',
    });
  }
}

if (loggingCfg.file.enabled) {
  const appRoot = path.join(__dirname, '../');
  rootCfg.streams.push({ path: path.join(appRoot, loggingCfg.file.path), level: loggingCfg.file.level || 'debug' });
}

const rootLogger = bunyan.createLogger(rootCfg);

module.exports = {
  getLogger() {
    return rootLogger;
  },
};
