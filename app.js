'use strict';

var boot = require('./app/boot');
var express = require('express');
var routes = require('./app/routes');

boot.newApp()
  .withLogging()
  .withRoutes(routes)
  .withViewEngine()
  .withAssets()
  .withServer()
  .start(express());
