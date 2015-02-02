module.exports = {
	setup: function(env) {
		var config = require('../knexfile')[env];
		if(config === void(0)) throw new Error('Database config for "' + env + '" environment not found.');
		return require('knex')(config);
	}
}