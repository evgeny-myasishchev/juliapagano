module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  required: [
    'name',
    'email',
  ],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    shotType: {
      enum: [
        null,
        '',
        'portrait session',
        'baby or family session',
      ],
    },
    email: {
      type: 'string',
      minLength: 1,
    },
    message: {
      type: 'string',
    },
  },
};
