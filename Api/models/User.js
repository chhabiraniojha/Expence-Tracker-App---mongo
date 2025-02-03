const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  totalExpence: {
    type: Number,
    required:true,
    default:0
  },
}, { timestamps: true });  

module.exports = mongoose.model('User', userSchema);




// const Sequelize=require('sequelize');

// const sequelize=require('../util/database');


// const Users=sequelize.define('user',{
//   id:{
//     type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
//   },
//   name:{
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   email:{
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   password:{
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   isPremium:{
//      type: Sequelize.BOOLEAN,
//      allowNull: false,
//      defaultValue: false
//     },
//   totalExpence:  Sequelize.INTEGER
// });

// module.exports=Users;