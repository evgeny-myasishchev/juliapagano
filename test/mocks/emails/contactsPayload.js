const chance = require('../chance');

module.exports = {
  name: chance.name(),
  shotType: chance.pick([
    null, 'portrait session', 'baby or family session'
  ]),
  email: chance.email(),
  message: chance.sentence()
};
