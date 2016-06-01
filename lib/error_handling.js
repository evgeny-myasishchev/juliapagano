'use strict';

var Promise = require('knex/lib/promise');
var logger = require('winston');

Promise.prototype.andHandleDbErrors = function (req) {
  return this.catch(function (err) {
    req.res.sendStatus(500);
    logger.error('Failed to perform db request.', err.message);
    throw err;
  });
};
