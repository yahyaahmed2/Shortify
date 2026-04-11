const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { createShortUrl, redirectUrl, getUrlStats } = require('../controller/shortUrlController');
const {signUp, login} = require('../controller/userController');


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many auth attempts" }
});


router.post('/shorten', createShortUrl);
router.post('/signup', authLimiter, signUp);
router.get('/stats/:shortCode', getUrlStats);
router.get('/:shortCode', redirectUrl);
router.post('/login', authLimiter, login)

module.exports = router;
