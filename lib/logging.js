const config = require('config');
const logger = require('winston');
const path = require('path');

logger.clear();
if (config.get('logging.stdout')) {
  logger.add(logger.transports.Console, { level: 'info' });
}

const logFile = config.get('logging.file');
if (logFile) {
  const appRoot = path.join(__dirname, '../');
  logger.add(logger.transports.File, {
    json: false,
    filename: path.join(appRoot, logFile)
  });
}

module.exports = {
  getLogger: function () {
    return logger;
  }
};
