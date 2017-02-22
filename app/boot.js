const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');
const co = require('co');
const config = require('config');
const connectAssets = require('connect-assets');
const db = require('./lib/db');
const logger = require('./logging').getLogger();
const pages = require('./lib/pages');
const Promise = require('bluebird');
const swig = require('swig');

function BootApp() {
  const bootStages = [];
  const self = this;

  function defineStage(name, stageFn) {
    return function stageBuilder(...args) {
      bootStages.push((app) => {
        args.unshift(app);
        logger.debug(`Performing bootstrap stage: ${name}`);
        return stageFn(...args);
      });

      return self;
    };
  }

  this.withLogging = defineStage('logging', (app) => {
    app.use(bunyanMiddleware({
      requestStart: true,
      headerName: 'X-Request-Id',
      propertyName: 'reqId',
      logName: 'reqId',
      obscureHeaders: [],
      logger,
    }));
  });

  this.withRoutes = defineStage('routes', (app, routes) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(routes);
    app.use((err, req, res, next) => {
      logger.error(err.stack);
      next(err);
    });
  });

  this.withViewEngine = defineStage('viewEngine', (app) => {
    app.engine('swig', swig.renderFile);

    app.set('view engine', 'swig');
    app.set('views', `${__dirname}/views`);

    // TODO: Enable in production
    swig.setDefaults({
      cache: config.get('swig.cache'),
      locals: {
        pages,
        contentConfig: config.content,
        dateTime: new Date(),
        goggleAnalytics: config.goggleAnalytics,
      },
    });
    app.set('view cache', false);
  });

  this.withAssets = defineStage('assets', (app) => {
    app.use(connectAssets(config.assets));
  });

  this.withMongo = defineStage('mongo', co.wrap(() => db.connect()));

  this.withServer = defineStage('server', (app) => {
    const port = config.port;
    const server = app.listen(port, () => {
      const host = server.address().address;
      logger.info('Application started in "%s" environment', app.get('env'));
      logger.info('Server listening at http://%s:%s', host, port);
    });
  });

  this.start = function start(app) {
    logger.info('Starting application...');
    Promise.each(bootStages, stage => stage(app));
  };
}

exports.newApp = function newApp() {
  return new BootApp();
};
