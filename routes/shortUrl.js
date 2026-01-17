const express = require('express');
const router = express.Router();
const { createShortUrl, redirectUrl } = require('../controller/shortUrlController');

router.post('/shorten', createShortUrl);
router.get('/:shortCode', redirectUrl);

module.exports = router;
