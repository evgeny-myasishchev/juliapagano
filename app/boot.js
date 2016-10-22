'use strict';

const config = require('config');
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
    const bunyanMiddleware = require('bunyan-middleware');
    app.use(bunyanMiddleware({
      requestStart: true,
      headerName: 'X-Request-Id',
      propertyName: 'reqId',
      logName: 'reqId',
      obscureHeaders: [],
      logger: logger
    }));
  });

  this.withRoutes = defineStage(function (app, routes) {
    const bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(routes);
    app.use(function (err, req, res, next) {
      logger.error(err.stack);
      next(err);
    });
  });

  this.withViewEngine = defineStage(function (app) {
    const swig = require('swig');
    const pages = require('./lib/pages');

    app.engine('swig', swig.renderFile);

    app.set('view engine', 'swig');
    app.set('views', __dirname + '/views');

    //TODO: Enable in production
    swig.setDefaults({
      cache: config.get('swig.cache'),
      locals: {
        pages: pages,
        contentConfig: config.content
      },
    });
    app.set('view cache', false);
  });

  this.withAssets = defineStage(function (app) {
    app.use(require('connect-assets')(config.assets));
  });

  this.withServer = defineStage(function (app) {
    const port = config.port;
    const server = app.listen(port, function () {
      const host = server.address().address;
      const port = server.address().port;
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
