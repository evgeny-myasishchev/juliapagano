const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');
const config = require('config');
const connectAssets = require('connect-assets');
const logger = require('./logging').getLogger();
const pages = require('./lib/pages');
const swig = require('swig');

function BootApp() {
  const bootStages = [];
  const self = this;

  function defineStage(stage) {
    return function stageBuilder(...args) {
      bootStages.push((app) => {
        args.unshift(app);
        stage(...args);
      });

      return self;
    };
  }

  this.withLogging = defineStage((app) => {
    app.use(bunyanMiddleware({
      requestStart: true,
      headerName: 'X-Request-Id',
      propertyName: 'reqId',
      logName: 'reqId',
      obscureHeaders: [],
      logger,
    }));
  });

  this.withRoutes = defineStage((app, routes) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(routes);
    app.use((err, req, res, next) => {
      logger.error(err.stack);
      next(err);
    });
  });

  this.withViewEngine = defineStage((app) => {
    app.engine('swig', swig.renderFile);

    app.set('view engine', 'swig');
    app.set('views', `${__dirname}/views`);

    // TODO: Enable in production
    swig.setDefaults({
      cache: config.get('swig.cache'),
      locals: {
        pages,
        contentConfig: config.content,
      },
    });
    app.set('view cache', false);
  });

  this.withAssets = defineStage((app) => {
    app.use(connectAssets(config.assets));
  });

  this.withServer = defineStage((app) => {
    const port = config.port;
    const server = app.listen(port, () => {
      const host = server.address().address;
      logger.info('Application started in "%s" environment', app.get('env'));
      logger.info('Server listening at http://%s:%s', host, port);
    });
  });

  this.start = function start(app) {
    for (let i = 0; i < bootStages.length; i += 1) {
      const stage = bootStages[i];
      stage(app);
    }
  };
}

exports.newApp = function newApp() {
  return new BootApp();
};
