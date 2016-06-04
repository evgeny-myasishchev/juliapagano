'use strict';

const boot = require('../lib/boot');
const router = require('../app/routes');
const request = require('supertest');
const express = require('express');
const expressSpy = require('./support/express-spy');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

chai.use(require('sinon-chai'));

describe('routes', function () {
  let app;
  before(() => {
    app = express();

    app.use(expressSpy);

    boot.newApp()
      .withLogging()
      .withRoutes(router)
      .withViewEngine()
      .start(app);
  });
  describe('GET /', function () {
    it('should render home page', function (done) {
      request(app).get('/').expect(200, function () {
        expect(expressSpy.last.res.render).to.have.been.calledWith('pages/home');
        done();
      });
    });
  });
});
