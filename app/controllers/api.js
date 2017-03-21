const express = require('express');

const Page = require('../models/Page');
const coRoute = require('../lib/coRoute');

const router = express.Router();

router.get('/api/v1/pages', coRoute(function* (req, res) {
  const pages = yield Page.getAll();
  res.json({ resources: pages.map(p => p.data) });
}));

module.exports = router;
