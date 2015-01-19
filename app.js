var boot = require('./lib/boot');

boot.newApp()
	.withAccessLog()
	.withControllers(require('./controllers'))
	.start({port: 3000});