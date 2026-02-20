const express = require('express');
const router = express.Router();
const { createShortUrl, redirectUrl, getUrlStats } = require('../controller/shortUrlController');
const {signUp, login} = require('../controller/userController');
router.post('/shorten', createShortUrl);
router.post('/signup', signUp);
router.get('/:shortCode', redirectUrl);
router.get('/stats/:shortCode', getUrlStats);
router.post('/login', login)

module.exports = router;
