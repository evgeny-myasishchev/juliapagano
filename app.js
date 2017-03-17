const boot = require('./app/boot');
const express = require('express');
const content = require('./app/controllers/content');

boot.newApp()
  .withLogging()
  .withMongo()
  .withRoutes(content)
  .withViewEngine()
  .withAssets()
  .withServer()
  .start(express());
