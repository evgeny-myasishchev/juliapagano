var _ = require('lodash');

var defaults = {
	debug: true,
	migrations: {
		tableName: 'knex_migrations',
		directory: './db/migrations'
	},
	seeds: {
		extension: 'js',
		directory: './db/seeds'
	}	
};

module.exports = {
	development: _.extend({
		client: 'sqlite3',
		connection: {
			filename: './db/development.sqlite3'
		}
	}, defaults),
	
	test: _.extend({
		client: 'sqlite3',
		connection: {
			filename: './db/test.sqlite3'
		}
	}, defaults)
};
