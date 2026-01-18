require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const shortUrlRoutes = require('./routes/shortUrl');

app.use('/', shortUrlRoutes); 

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected! "))
.catch(err => console.log("MongoDB connection error: ", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));