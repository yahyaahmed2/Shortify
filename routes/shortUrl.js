const express = require('express');
const router = express.Router();
const { createShortUrl, redirectUrl, getUrlStats } = require('../controller/shortUrlController');
const {signUp} = require('../controller/userController');
router.post('/shorten', createShortUrl);
router.post('/signup', signUp);
router.get('/:shortCode', redirectUrl);
router.get('/stats/:shortCode', getUrlStats);

module.exports = router;
