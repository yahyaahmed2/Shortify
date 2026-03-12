const { model } = require('mongoose');
const { User } = require('../model/shortUrl');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config();
const saltRounds = 10;


const signUp = async(req, res) => {
  try{
    const {userName, email, password} = req.body;
    if (!userName || !email || !password){
        return res.status(400).json({message: "One or more fields are missing"});
    }
    if (!validator.isEmail(email)){
      return res.status(400).json({message: "Invalid email format"});
    }
    if (password.length < 8 || password.length > 72){
      return res.status(400).json( {message: "Error, Password must be between 8 and 72"} );
    }

     const existingUser = await User.findOne({
         $or:[
            { userName: userName },
            { email: email }
        ]
    });

    if(existingUser){
        return res.status(400).json( {message: "Error, user already exists" } );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; 
    if (!identifier || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {signUp, login};