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
    const normalizedEmail = validator.normalizeEmail(email);
    if (!userName || !normalizedEmail || !password){
        return res.status(400).json({message: "One or more fields are missing"});
    }
    if (!validator.isEmail(normalizedEmail)){
      return res.status(400).json({message: "Invalid email format"});
    }
    if (!validator.isStrongPassword(password, { 
    minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 
    })) {
      return res.status(400).json({ message: "Password must include atleast 8 charachters, uppercase, lowercase, number, and symbol" });
    }

     const existingUser = await User.findOne({
         $or:[
            { userName: userName },
            { email: normalizedEmail }
        ]
    });

    if(existingUser){
        return res.status(400).json( {message: "Error, user already exists" } );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ userName, email: normalizedEmail, password: hashedPassword });
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
    }).select("+password");

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