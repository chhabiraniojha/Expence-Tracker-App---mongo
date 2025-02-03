const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: false,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Each ForgotPassword belongs to one User
}, { timestamps: true });

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);

// const Sequelize=require('sequelize');

// const sequelize=require('../util/database');


// const ForgotPassword=sequelize.define('forgotPassword',{
//   id:{
//     type:Sequelize.UUID,
//     allowNull:false,
//     primaryKey:true
//   },
//   isActive:{
//     type:Sequelize.BOOLEAN,
//     allowNull:false,
//     defaultValue:false
//   }
// });

// module.exports=ForgotPassword;