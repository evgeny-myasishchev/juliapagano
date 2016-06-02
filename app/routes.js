'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('This is home page');
});

router.get('/about', function (req, res) {
  res.send('This is about page');
});

router.get('/portfolio', function (req, res) {
  res.send('This is portfolio page');
});

router.get('/kind-words', function (req, res) {
  res.send('This is kind-words page');
});

router.get('/info-and-prices', function (req, res) {
  res.send('This is info and prices page');
});

router.get('/contact', function (req, res) {
  res.send('This is contact page');
});

module.exports = router;
