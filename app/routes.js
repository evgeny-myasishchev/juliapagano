'use strict';

const express = require('express');
const router = express.Router();
const pages = require('./lib/pages');

router.get('/', function (req, res) {
  res.render('pages/home', { currentPage: pages.home });
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

router.get('/contacts', function (req, res) {
  res.render('pages/contacts', { currentPage: pages.contacts });
});

module.exports = router;
