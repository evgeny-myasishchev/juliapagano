const config = require('config');
const express = require('express');

const Page = require('../models/Page');
const coRoute = require('../lib/coRoute');
const routeAuthMiddleware = require('../lib/routeAuthMiddleware');

const router = express.Router();
const routeAuth = routeAuthMiddleware.createMiddleware(config.get('api'));

router.get('/api/v1/pages', routeAuth(['pages:read']), coRoute(getPages));

function* getPages(req, res) {
  const pages = yield Page.getAll();
  res.json({ resources: pages.map(p => p.data) });
}

module.exports = router;
