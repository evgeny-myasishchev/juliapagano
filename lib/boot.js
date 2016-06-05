'use strict';

const logger = require('./logging').getLogger();

const BootApp = function () {
  const bootStages = [];
  const self = this;

  const defineStage = function (stage) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      bootStages.push(function (app) {
        args.unshift(app);
        stage.apply(null, args);
      });

      return self;
    };
  };

  this.withLogging = defineStage(function (app) {
    var morgan = require('morgan');
    app.use(morgan('combined', { stream: {
      write: function (message) {
        logger.info(message.slice(0, -1)); //Removing last char to avoid extra new line
      },
    }, }));
  });

  this.withRoutes = defineStage(function (app, routes) {
    app.use(routes);
    app.use(function (err, req, res, next) {
      logger.error(err.stack);
      next(err);
    });
  });

  this.withViewEngine = defineStage(function (app) {
    const swig = require('swig');
    const pages = require('./pages');

    app.engine('swig', swig.renderFile);

    app.set('view engine', 'swig');
    app.set('views', __dirname + '/../app/views');

    //TODO: Enable in production
    swig.setDefaults({
      cache: false,
      locals: {
        pages: pages
      },
    });
    app.set('view cache', false);
  });

  this.withAssets = defineStage(function (app) {
    app.use(require('connect-assets')({
      paths: [
       __dirname + '/../app/assets/css',
       __dirname + '/../app/assets/js',
       __dirname + '/../vendor/assets',
      ],
      buildDir: '/public/assets',
    }));
  });

  this.withServer = defineStage(function (app, port) {
    var server = app.listen(port, function () {
      var host = server.address().address;
      var port = server.address().port;
      logger.info('Application started in "%s" environment', app.get('env'));
      logger.info('Server listening at http://%s:%s', host, port);
    });
  });

  this.start = function (app) {
    for (var i = 0; i < bootStages.length; i++) {
      var stage = bootStages[i];
      stage(app);
    }
  };
};

exports.newApp = function () {
  return new BootApp();
};
