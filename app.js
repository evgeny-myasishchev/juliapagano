var boot = require('./lib/boot');
var express = require('express');
var controllers = require('./app/controllers');

boot.newApp()
  .withLogging()
  .withControllers(controllers)
  .withViewEngine()
  .withAssets()
  .withDb()
  .withReadModels()
  .withPages(controllers.pagesController)
  .withServer(3000)
  .start(express());
