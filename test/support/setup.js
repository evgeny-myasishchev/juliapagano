'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const Promise = require('bluebird');
const sinonChai = require('sinon-chai');
const logging = require('../../app/logging');
require('sinon-as-promised')(Promise);

chai.use(sinonChai);

const logger = logging.getLogger().child({ tests: true });

global.loggingHookup = function () {
    beforeEach(function () {
        logger.info('============================================================');
        logger.info('=== Starting test "' + this.currentTest.fullTitle() + '" ===');
        logger.info('============================================================');
      });

    afterEach(function () {
        logger.info('===========================================================================');
        logger.info('Test ' + this.currentTest.state + ' "' + this.currentTest.fullTitle() + '"');
        logger.info('===========================================================================');
      });
  };
