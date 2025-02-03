const Users = require('../models/User')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

const generateAccessToken=(id,name)=>{
    return jwt.sign({userId:id,userName:name},process.env.SECRET_KEY)
}
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    // Hash the password before saving
    bcrypt.hash(password, 10, async function (err, hash) {
      const user = new Users({ name, email, password: hash });
      await user.save();  // MongoDB method to save a new document
      res.status(201).json(user);  // Send response with user data
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error during signup' });
  }
};


exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email }); // MongoDB method for finding one user
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          return res.status(200).json({ data: user, message: "success logged in", token: generateAccessToken(user._id, user.name) });
        } else {
          return res.status(401).json("Password mismatch");
        }
      });
    } else {
      return res.status(404).json('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: 'Error during signin' });
  }
};


exports.getUser = async (req, res, next) => {
  const email = req.params.email;
  try {
    const user = await Users.findOne({ email }); // Find user by email in MongoDB
    user ? res.json(true) : res.json(false);  // Return true if user exists, false otherwise
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error during email check' });
  }
};


exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id); // Find user by _id in MongoDB
    res.status(200).json({ userDetails: { id: user._id, name: user.name, email: user.email, isPremium: user.isPremium, isLoggedIn: true } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user information' });
  }
};
