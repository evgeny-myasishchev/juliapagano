'use strict';

exports.seed = function(knex, Promise) {
	return knex.insert([{
		title: 'Home',
		path: '/',
		content: '<h1>Hello, this is home page</h1>'
	}, {
		title: 'Galleries',
		path: '/galleries',
		content: '<h1>Hello, this is galleries page</h1>'
	}, {
		title: 'Blog',
		path: 'http://juliapagano.blogspot.co.uk/',
		is_external: true
	}, {
		title: 'Contacts',
		path: '/contacts',
		content: '<h1>Hello, this is contact page</h1>'
	}]).into('pages');
};