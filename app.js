var boot = require('./lib/boot');

boot.newApp()
	.withAccessLog()
	.withControllers()
	.start({port: 3000});