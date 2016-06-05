'use strict';

const sinon = require('sinon');

const expressSpy = (function () {
  const fn = function (req, res, next) {
    fn.last = { req, res };
    sinon.spy(res, 'render');
    next();
  };

  return fn;
})();

module.exports = expressSpy;
