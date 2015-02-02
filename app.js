var boot = require('./lib/boot');
var express = require('express');

boot.newApp()
	.withLogging()
	.withControllers(require('./app/controllers'))
	.withViewEngine()
	.withAssets()
	.withDb()
	.withServer(3000)
	.start(express());