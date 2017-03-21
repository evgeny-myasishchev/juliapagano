const express = require('express');

const api = require('./app/controllers/api');
const boot = require('./app/boot');
const content = require('./app/controllers/content');

boot.newApp()
  .withLogging()
  .withMongo()
  .withRoutes([content, api])
  .withViewEngine()
  .withAssets()
  .withServer()
  .start(express());
