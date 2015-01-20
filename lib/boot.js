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