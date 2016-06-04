'use strict';

const router = require('../app/routes');
const request = require('supertest');
const express = require('express');

const app = express().use(router);

describe('routes', function () {
  describe('GET /', function () {
    it('should render home page', function (done) {
      request(app).get('/').expect(200, done);
    });
  });
});
