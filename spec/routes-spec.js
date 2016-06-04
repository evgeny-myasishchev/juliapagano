'use strict';

const boot = require('../lib/boot');
const router = require('../app/routes');
const request = require('supertest');
const express = require('express');

const app = express();
const expressSpy = require('./support/express-spy');
app.use(expressSpy);

boot.newApp()
  .withLogging()
  .withRoutes(router)
  .withViewEngine()
  .start(app);

describe('routes', function () {
  describe('GET /', function () {
    it('should render home page', function (done) {
      request(app).get('/').expect(200, function () {
        expect(expressSpy.last.res.render).toHaveBeenCalledWith('pages/home');
        done();
      });
    });
  });
});
