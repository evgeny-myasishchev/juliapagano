const _ = require('lodash');
const co = require('co');
const config = require('config');
const emailProvider = require('./lib/emailProvider');
const EmailTemplate = require('./lib/EmailTemplate');
const express = require('express');
const pages = require('./lib/pages');
const photoset = require('./models/photoset');
const Promise = require('bluebird');
const schema = require('./lib/schema');

const router = express.Router();

schema.add(require('./schema/contactRequest'), 'contactRequest');

function invoke(generator) {
  return function invokeWrapper(req, res) {
    co.wrap(generator)(req, res)
    .catch((err) => {
      req.log.error(err);
      res.sendStatus(500);
    });
  };
}

router.get('/', (req, res) => {
  photoset.getPhotos(pages.home.carousel.photosetId)
    .then((ps) => {
      res.render('pages/home', { currentPage: pages.home, carouselPhotoset: ps });
    })
    .catch((err) => {
      req.log.error('Failed to get photos.', err);
      res.sendStatus(500);
    });
});

router.get('/about', (req, res) => {
  photoset.getPhotos(pages.about.selfie.photosetId)
    .then((ps) => {
      res.render('pages/about', {
        currentPage: pages.about,
        selfie: ps.items[0],
      });
    })
    .catch((err) => {
      req.log.error('Failed to get photos.', err);
      res.sendStatus(500);
    });
});

router.get('/portfolio', (req, res) => {
  photoset.getPhotos(pages.portfolio.gallery.photosetId)
    .then((ps) => {
      res.render('pages/portfolio', { currentPage: pages.portfolio, galleryPhotoset: ps });
    })
    .catch((err) => {
      req.log.error('Failed to get photos.', err);
      res.sendStatus(500);
    });
});

router.get('/kind-words', (req, res) => {
  res.render('pages/kind-words', { currentPage: pages['kind-words'] });
});

router.get('/info-and-prices', invoke(function* (req, res) {
  const currentPage = pages['info-and-prices'];
  const photosets = _.fromPairs(
    yield Promise.map(currentPage.prices, co.wrap(function* (price) {
      req.log.debug(`Fetching price photoset: ${price.photosetId}`);
      return [price.photosetId, yield photoset.getPhotos(price.photosetId)];
    }))
  );

  res.render('pages/info-and-prices', { currentPage, photosets });
}));

router.get('/special-offers', invoke(function* (req, res) {
  const currentPage = pages['special-offers'];
  let ps;
  if (currentPage.photosetId) {
    ps = yield photoset.getPhotos(currentPage.photosetId);
  }

  res.render('pages/special-offers', { currentPage, photoset: ps });
}));

router.get('/contacts', (req, res) => {
  res.render('pages/contacts', { currentPage: pages.contacts });
});

router.post('/contacts', schema.validateRequest('contactRequest'), invoke(function* (req, res) {
  req.log.info('Sending contacts message');
  yield emailProvider.sendEmail({
    from: req.body.email,
    to: config.get('contacts.sendTo'),
    template: new EmailTemplate('contacts', req.body),
  });
  req.log.info('Sending contacts thanks message');
  yield emailProvider.sendEmail({
    from: config.get('contacts.sendTo'),
    to: req.body.email,
    template: new EmailTemplate('contactsThanks', req.body),
  });
  res.end();
}));

module.exports = router;
