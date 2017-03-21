const express = require('express');

const router = express.Router();

router.get('/api/v1/pages', (req, res) => {
  res.end();
});

module.exports = router;
