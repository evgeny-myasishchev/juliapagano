const config = require('config');
const express = require('express');

const Page = require('../models/Page');
const coRoute = require('../lib/coRoute');
const bearerAuthMiddleware = require('../lib/bearerAuthMiddleware');

const router = express.Router();
const bearerAuth = bearerAuthMiddleware.init(config.get('api'));

router.get('/api/v1/pages', bearerAuth(['pages:read']), coRoute(getPages));

function* getPages(req, res) {
  const pages = yield Page.getAll();
  res.json({ resources: pages.map(p => p.data) });
}

module.exports = router;
