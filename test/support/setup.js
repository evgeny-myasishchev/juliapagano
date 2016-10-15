process.env.NODE_ENV = 'test';

const nock = require('nock');

nock.disableNetConnect();
