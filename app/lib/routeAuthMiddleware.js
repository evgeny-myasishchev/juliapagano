const _ = require('lodash');
const jwt = require('jsonwebtoken');

const HttpError = require('./HttpError');
const logging = require('../logging');

const logger = logging.getLogger();

// TODO: Unit test
module.exports = {
  init(config) {
    return function (scopes) {
      const tokenSecret = config.jwtTokenSecret;
      if (!tokenSecret) throw new Error('Config error: Please provide jwtTokenSecret');

      return function (req, res, next) {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
          const err = new HttpError(401, 'Unauthorized', 'Auth header not found');
          // TODO: test
          err.responseHeaders = {
            'WWW-Authenticate': 'Bearer',
          };
          throw err;
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
          logger.info({ msgData: { authHeader } }, 'Unexpected structure of Authorization header. It should be: Bearer XXX');
          throw new HttpError(401, 'Unauthorized', 'Unexpected auth header structure');
        }
        const authSceme = parts[0];
        if (authSceme !== 'Bearer') throw new HttpError(401, 'Unauthorized', `Unexpected auth schema: ${authSceme}. Expected: Bearer`);
        let token;
        try {
          token = jwt.verify(parts[1], tokenSecret, {
            issuer: config.jwtTokenIss,
            audience: config.jwtTokenAud,
          });
        } catch (e) {
          const err = new HttpError(401, 'Unauthorized', e.message);
          err.stack = e.stack;
          throw err;
        }
        const tokenScopes = _.get(token, 'scope', '').split(' ');
        for (const requiredScope of scopes) {
          if (!_.includes(tokenScopes, requiredScope)) {
            logger.info({ msgData: { token, requiredScopes: scopes } }, 'Invalid scopes');
            throw new HttpError(403, 'Forbidden', `Invalid scopes. Required scopes: [${scopes}]`);
          }
        }
        logger.info('Request authenticated');
        next();
      };
    };
  },
};
