const Users = require('../models/User')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

const generateAccessToken=(id,name)=>{
    return jwt.sign({userId:id,userName:name},process.env.SECRET_KEY)
}
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    bcrypt.hash(password, 10, async function (err, hash) {
      // Store hash in your password DB.
      const user = await Users.create({ name, email, password: hash });
      res.json(user);
    });

  } catch (error) {
    console.log(error)
  }
}

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findAll({
      where: {
        email: email
      }
    })
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, function (err, result) {
        // result == true
        if (result) {
          return res.status(200).json({data:user[0],message:"success loged in",token:generateAccessToken(user[0].id,user[0].name)})
        } else {
          return res.status(401).json("password mismatch")
        }
      });


    } else {
      return res.status(404).json('user not found')
    }

  } catch (error) {
    res.json(error)
  }

}

exports.getUser = async (req, res, next) => {
  // checking the email is already exits or not

  const email = req.params.email;
  try {
    const user = await Users.findAll({
      where: {
        email: email
      }
    });
    user.length > 0 ? res.json(true) : res.json(false)

  } catch (error) {
    console.log(error)
  }

}

exports.getUserInfo=async (req,res,next)=>{

  try {
    const user=await Users.findByPk(req.user.id)
    
    res.status(200).json({userDetails:{id:user.id,name:user.name,email:user.email,isPremium:user.isPremium,isLoggedIn:true}})
  } catch (error) {
    res.json(error)
  }

}