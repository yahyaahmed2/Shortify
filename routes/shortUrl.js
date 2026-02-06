const express = require('express');
const router = express.Router();
const { createShortUrl, redirectUrl, getUrlStats } = require('../controller/shortUrlController');

router.post('/shorten', createShortUrl);
router.get('/:shortCode', redirectUrl);
router.get('/stats/:shortCode', getUrlStats);

module.exports = router;
