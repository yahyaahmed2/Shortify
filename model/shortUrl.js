const { url } = require('inspector');
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    expiryDate: { type: Date }
});

const user = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8}
});

const Url = mongoose.model('Url', urlSchema);
const User = mongoose.model('User', user);

module.exports = { Url, User };
