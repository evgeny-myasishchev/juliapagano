'use strict';

const chance = require('chance')();

chance.mixin({
  contactsRequestPayload: () => ({
    name: chance.name(),
    shotType: chance.pick([
      null, 'portrait session', 'baby or family session'
    ]),
    email: chance.email(),
    message: chance.sentence()
  })
});

module.exports = chance;
