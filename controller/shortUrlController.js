const ShortUrl = require('../model/shortUrl');
const { customAlphabet } = require('nanoid');
//length of path is 7, with 3.5 trillion URLS
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 7);
const createShortUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl || longUrl.trim() === '') return res.status(400).json(
      {
         message: 'longUrl is required' 
      });

    const shortCode = nanoid();
    const newShort = new ShortUrl({ shortCode, longUrl });
    await newShort.save();

    res.status(201).json({
      shortCode,
      shortUrl: `http://localhost:5000/${shortCode}` 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await ShortUrl.findOne({ shortCode });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    url.clicks += 1;
    await url.save();

    res.redirect(url.longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createShortUrl, redirectUrl };
