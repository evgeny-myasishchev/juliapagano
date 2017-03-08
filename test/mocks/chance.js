const _ = require('lodash');
const chance = require('chance')();

chance.mixin({
  page: opts => (_.merge({
    _id: `page-${chance.word()}`,
    title: `Title ${chance.word()}`,
    blocks: [
      {
        type: `block-type-${chance.word()}`,
        title: `Block Title ${chance.word()}`,
        description: chance.sentence(),
      },
    ],
  }, opts)),

  specialOfferPage: (opts) => {
    const page = _.merge(chance.page(), {
      _id: `special-offers/${chance.word()}`,
      section: 'special-offers',
    }, opts);
    page.blocks.push({
      type: 'special-offer',
      flickr: {
        photoset: {
          items: [{
            sizes: { 'Medium 640': {} },
          }],
        },
      },
    });
    return page;
  },

  blockWithPhotoset: opts => (_.merge({
    id: `block-id-${chance.word({ length: 10 })}`,
    type: 'block-with-photoset',
    flickr: {
      photosetId: `photoset-${chance.word()}`,
    },
  }, opts)),

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
