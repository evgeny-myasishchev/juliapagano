'use strict';

exports.seed = function(knex, Promise) {
	return knex.insert([{
		title: 'Home',
		path: '/',
		template: 'pages/home'
	}, {
		title: 'Galleries',
		path: '/galleries',
		template: 'pages/galleries'
	}, {
		title: 'Blog',
		path: 'http://juliapagano.blogspot.co.uk/',
		is_external: true
	}, {
		title: 'Contacts',
		path: '/contacts',
		template: 'pages/contacts'
	}]).into('pages');
};