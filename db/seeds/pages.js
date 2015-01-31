'use strict';

module.exports.seed = function(knex, Promise) {
	knex('pages').insert({
		title: 'Home',
		url: '/',
		content: '<h1>Hello, this is home page</h1>'
	}).then(function(rows) {
		console.log(rows);
	}).catch(function(error) {
		console.error(error);
	});
	// knex('pages').insert({
	// 	title: 'Galleries',
	// 	url: '/galleries',
	// 	content: '<h1>Hello, this is galleries page</h1>'
	// });
	// knex('pages').insert({
	// 	title: 'Blog',
	// 	url: 'http://juliapagano.blogspot.co.uk/',
	// 	is_external: true
	// });
	// knex('pages').insert({
	// 	title: 'Contact',
	// 	url: '/galleries',
	// 	content: '<h1>Hello, this is contact page</h1>'
	// });
	//
	// knex('users').select('title', 'url').then(function() {
	// 	console.log(arguments);
	// });
};