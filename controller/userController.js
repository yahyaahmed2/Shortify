const { model } = require('mongoose');
const { User } = require('../model/shortUrl');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const signUp = async(req, res) => {
  try{
    const {userName, email, password} = req.body;
    if (!userName || !email || !password){
        return res.status(400).json({message: "One or more fields are missing"});
    }
    if (password.length < 8){
      return res.status(400).json( {message: "Password too short. Minimum charachters 8"} );
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


module.exports = {signUp};