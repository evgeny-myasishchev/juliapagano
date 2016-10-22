const chance = require('../chance');
const config = require('config');

module.exports = {
  name: chance.name(),
  email: config.get('contacts.sendTo')
};
