var BootApp = function() {
	var bootStages = [];
	var self = this;
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
	
	this.withAccessLog = defineStage(function(app) {
		var morgan = require('morgan');
		app.use(morgan('combined'));
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
	
	this.withServer = defineStage(function(app, port) {
		var server = app.listen(port, function () {
			var host = server.address().address;
			var port = server.address().port;
			console.log('Server listening at http://%s:%s', host, port);
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