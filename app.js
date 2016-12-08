const boot = require('./app/boot');
const express = require('express');
const routes = require('./app/routes');

boot.newApp()
  .withLogging()
  .withRoutes(routes)
  .withViewEngine()
  .withAssets()
  .withServer()
  .start(express());
