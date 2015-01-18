var AppBoot = function() {
	var bootStages = [];
	var self = this;
	var defineStage = function(stage) {
		return function() {
			bootStages.push(stage);
			return self;
		}
	}
	
	this.withAccessLog = defineStage(function(app) {
		var morgan = require('morgan');
		app.use(morgan('combined'));
	});
	
	this.withControllers = defineStage(function(app) {
		app.get('/', function (req, res) {
		  res.send('Hello World!')
		});
	});
	
	this.start = function(options) {
		var express = require('express');
		var app = express();
		
		for(var i = 0; i < bootStages.length; i++) {
			var stage = bootStages[i];
			stage(app);
		}
		var server = app.listen(options.port, function () {
			var host = server.address().address;
			var port = server.address().port;
			console.log('Example app listening at http://%s:%s', host, port);
		});
	}
}

exports.newApp = function() {
	return new AppBoot();
};