var express = require('express'),
	boot = require('../lib/boot'),
	request = require('supertest'),
	async = require('async'),
	Promise = require('bluebird');
	
require('./helpers/routing-matchers.js');

describe('routes', function() {
	var bootApp, app;
	beforeEach(function() {
		app = express();
		bootApp = boot.newApp();
	});
	
	describe('regular routes', function() {
		var controllers;
		beforeEach(function() {
			controllers = {};
			bootApp.withControllers(controllers).start(app);
		});
		it('should route /admin to home.index', function(done) {
			expect(request(app).get('/admin')).toRouteTo(controllers, 'admin_controller', 'index', done);
		});
	});
	
	describe('page routes', function() {
		var pages, pages_controller;
		beforeEach(function() {
			pages_controller = {
				createPageAction: function(page) {
					return function(req, res) {
						res.send(page.path);
					}
				}
			};
			pages = [ {path: '/page-1'}, {path: '/page-2'}, {path: '/external', is_external: true} ];
			app.set('pages-read-model', {
				getPages: function() { return Promise.resolve(pages) }
			});
			bootApp.withPages(pages_controller).start(app);
		});
		
		it('should route regular pages', function(done) {
			async.series([
				function(cb) { 
					request(app).get('/page-1').expect(200).expect('/page-1').end(function(err) {
						if(err) fail(err);
						cb();
					});
				},
				function(cb) {
					request(app).get('/page-2').expect(200).expect('/page-2').end(function(err) {
						if(err) fail(err);
						cb();
					});
				}
			], done);
		});
		
		it('should not route external pages', function(done) {
			request(app).get('/external').expect(404).end(function(err) {
				if(err) fail(err);
				done();
			});
		});
	});
});