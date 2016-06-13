'use strict';

const express = require('express');
const router = express.Router();
const pages = require('./lib/pages');
const photoset = require('./models/photoset');

router.get('/', function (req, res) {
  photoset.getPhotos(pages.home.carousel.photosetId)
    .then(function (photoset) {
      res.render('pages/home', { currentPage: pages.home, carouselPhotoset: photoset });
    })
    .catch(function (err) {
      req.log.error('Failed to get photos.', err);
      res.sendStatus(500);
    });
});

router.get('/about', function (req, res) {
  res.send('This is about page');
});

router.get('/portfolio', function (req, res) {
  res.render('pages/portfolio', { currentPage: pages.portfolio });
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
