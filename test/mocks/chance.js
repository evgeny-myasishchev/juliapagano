const chance = require('chance')();

chance.mixin({
  page: () => ({
    _id: `page-${chance.word()}`,
    title: `Title ${chance.word()}`,
    blocks: [
      {
        type: `block-type-${chance.word()}`,
        title: `Block Title ${chance.word()}`,
        description: chance.sentence(),
      },
    ],
  }),

  contactsRequestPayload: () => ({
    name: chance.name(),
    shotType: chance.pick([
      null, 'portrait session', 'baby or family session',
    ]),
    email: chance.email(),
    message: chance.sentence(),
  }),
});

module.exports = chance;
