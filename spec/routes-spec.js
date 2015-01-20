var express = require('express'),
	boot = require('../lib/boot'),
	request = require('supertest');

describe('routes', function() {
	var bootApp, app, controllers;
	beforeAll(function() {
		bootApp = boot.newApp();
		controllers = {};
		app = express();
		bootApp.withControllers(controllers).start(app);
	});
	
	it('should route / to home.index', function(done) {
		expect(request(app).get('/')).toRouteTo(controllers, 'home', 'index', done);
	});
});