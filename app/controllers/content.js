const _ = require('lodash');
const co = require('co');
const config = require('config');
const emailProvider = require('../lib/emailProvider');
const EmailTemplate = require('../lib/EmailTemplate');
const express = require('express');
const Page = require('../models/Page');
const pages = require('../lib/pages');
const schema = require('../lib/schema');

const router = express.Router();

schema.add(require('../schema/contactRequest'), 'contactRequest');

function invoke(generator) {
  return function invokeWrapper(req, res) {
    co.wrap(generator)(req, res)
    .catch((err) => {
      req.log.error(err);
      res.sendStatus(_.get(err, 'httpStatus', 500));
    });
  };
}

router.get('/special-offers', invoke(function* (req, res) {
  const currentPage = pages['special-offers'];
  const specialOffers = yield Page.getBySection(currentPage.id);
  for (const offer of specialOffers) {
    yield offer.preloadPhotosets();
  }
  res.render('pages/special-offers', {
    currentPage,
    specialOffers,
  });
}));

router.get('/special-offers/*', invoke(function* (req, res) {
  const pageId = req.path.substr(1, req.path.length);
  req.log.info(`Rendering special offer page: ${pageId}`);
  const currentPage = yield Page.get(pageId);
  yield currentPage.preloadPhotosets();
  const parentPage = pages['special-offers'];
  res.render('pages/special-offer', {
    parentPage,
    currentPage,
  });
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

// We only match single level. We don't have nested pages.
// This will also let us rener static assets (e.g /assets/bootstrap/css/bootstrap.css)
router.get(/^\/[\w-]*$/, invoke(function* (req, res) {
  const pageId = req.path === '/' ? 'home' : req.path.substr(1, req.path.length);
  req.log.info(`Rendering dynamic page: ${pageId}`);
  const page = yield Page.get(pageId);
  yield page.preloadPhotosets();
  res.render(`pages/${page.id}`, { currentPage: page });
}));

module.exports = router;
