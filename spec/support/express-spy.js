'use strict';

const expressSpy = (function () {
  const fn = function (req, res, next) {
    fn.last = { req, res };
    spyOn(res, 'render').and.callThrough();
    next();
  };

  return fn;
})();

module.exports = expressSpy;
