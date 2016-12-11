const boot = require('./app/boot');
const express = require('express');
const routes = require('./app/routes');

boot.newApp()
  .withLogging()
  .withMongo()
  .withRoutes(routes)
  .withViewEngine()
  .withAssets()
  .withServer()
  .start(express());
