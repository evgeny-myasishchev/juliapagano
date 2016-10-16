'use strict';

const ajv = new (require('ajv'))();

function validateRequest(schema) {
  return function (req, res, next) {
    const payload = req.body;
    const valid = ajv.validate(schema, payload);
    if (!valid) {
      const errors = ajv.errorsText();
      req.log.info({ payload, errors }, 'Data validation failed');
      return res.status(400).end(errors);
    }

    next();
  };
}

module.exports = {
  add: ajv.addSchema,
  validateRequest: validateRequest
};
