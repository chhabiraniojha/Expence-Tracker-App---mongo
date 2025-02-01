const Sequelize=require('sequelize');

const sequelize=require('../util/database');


const ForgotPassword=sequelize.define('forgotPassword',{
  id:{
    type:Sequelize.UUID,
    allowNull:false,
    primaryKey:true
  },
  isActive:{
    type:Sequelize.BOOLEAN,
    allowNull:false,
    defaultValue:false
  }
});

module.exports=ForgotPassword;