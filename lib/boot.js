var fs = require('fs');
var path = require('path');
var logger = require('winston');
require('./error_handling');

var BootApp = function() {
	var bootStages = [];
	var self = this;
	
	var appRoot = path.join(__dirname, '../');
	var logsDir = path.join(appRoot, 'log');
	
	var defineStage = function(stage) {
		return function() {
			var args = Array.prototype.slice.call(arguments);
			bootStages.push(function(app) {
				args.unshift(app);
				stage.apply(null, args);
			});
			return self;
		}
	}
	
	var routeTo = function(controllers, controllerName, actionName) {
		return function() {
			var controller = controllers[controllerName];
			controller[actionName].apply(controller, arguments);
		}
	}
	
	this.withLogging = defineStage(function(app) {
		logger.remove(logger.transports.Console);
		logger.add(logger.transports.Console, { level: 'info' });
		logger.add(logger.transports.File, { 
			json: false,
			filename: path.join(logsDir, app.get('env') + '.log') }
		);
		
		var morgan = require('morgan');
		app.use(morgan('combined', {stream: {
			write: function(message) {
				logger.info(message.slice(0, -1)); //Removing last char to avoid extra new line
			}
		}}));
	});
	
	this.withControllers = defineStage(function(app, controllers) {
		app.get('/', routeTo(controllers, 'home', 'index'));
	});
		
	this.withViewEngine = defineStage(function(app) {
		var swig = require('swig');
		
		app.engine('swig', swig.renderFile);
		
		app.set('view engine', 'swig');
		app.set('views', __dirname + '/../app/views');
		
		//TODO: Enable in production
		swig.setDefaults({ cache: false });
		app.set('view cache', false);
	});
	
	this.withAssets = defineStage(function(app) {
		app.use(require("connect-assets")({
			paths: [
				__dirname + '/../app/assets/css',
				__dirname + '/../app/assets/js',
				__dirname + '/../vendor/assets'
			],
			buildDir: '/public/assets'
		}));
	});
	
	this.withDb = defineStage(function(app) {
		var db = require('../db').setup(app.get('env'));
		app.set('db', db);
	});
	
	this.withServer = defineStage(function(app, port) {
		var server = app.listen(port, function () {
			var host = server.address().address;
			var port = server.address().port;
			logger.info('Application started in "%s" environment', app.get('env'));
			logger.info('Server listening at http://%s:%s', host, port);
		});
	});
	
	this.start = function(app) {
		for(var i = 0; i < bootStages.length; i++) {
			var stage = bootStages[i];
			stage(app);
		}
	};
}

exports.newApp = function() {
	return new BootApp();
};