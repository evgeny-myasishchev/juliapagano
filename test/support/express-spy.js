const sinon = require('sinon');

module.exports = {
  stubRes: false,
  last: null,
  create() {
    const self = this;
    const fn = function (req, res, next) {
      self.last = { req, res };
      if (self.stubRes) {
        sinon.stub(res, 'render', () => {
          res.end('Stub');
        });
      } else {
        sinon.spy(res, 'render');
      }
      next();
    };
    return fn;
  },
};
