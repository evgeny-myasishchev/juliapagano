const _ = require('lodash');

const HttpError = require('./HttpError');
const logging = require('../logging');

const logger = logging.getLogger();

// TODO: Unit test
module.exports = function (opts) {
  const showStack = _.get(opts, 'showStack', false);

  // Next has to be here as error handling middleware supposed to have 4 args
  return function (err, req, res, next) { // eslint-disable-line no-unused-vars
    logger.error(err, 'Request failed');
    const httpError = HttpError.fromError(err);
    res.status(httpError.statusCode);
    if (httpError.responseHeaders) res.set(httpError.responseHeaders);
    if (req.accepts('json')) {
      const json = {
        error: {
          statusCode: httpError.statusCode,
          statusMessage: httpError.statusMessage,
          details: httpError.details,
        },
      };
      if (showStack) json.error.stack = httpError.stack;
      return res.json(json);
    }
    return showStack ? res.send(httpError.stack) : res.send(httpError.toString());
  };
};
