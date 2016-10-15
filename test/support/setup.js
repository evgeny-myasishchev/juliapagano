process.env.NODE_ENV = 'test';

const chai = require('chai');
const nock = require('nock');
const Promise = require('bluebird');
const sinonChai = require('sinon-chai');
require('sinon-as-promised')(Promise);

chai.use(sinonChai);
nock.disableNetConnect();
