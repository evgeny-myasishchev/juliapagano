'use strict';

module.exports.up = function(knex, Promise) {
	return knex.schema.createTable('pages', function (table) {
		table.increments();
		table.string('title').notNullable();
		table.string('path').notNullable().unique();
		table.boolean('is_external').defaultTo(false);
		table.text('content');
		table.timestamps();
	});
};

module.exports.down = function(knex, Promise) {
	return knex.schema.dropTable('pages');
};
