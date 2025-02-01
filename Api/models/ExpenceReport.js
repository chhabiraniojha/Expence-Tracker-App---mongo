const Sequelize=require('sequelize');

const sequelize=require('../util/database');


const ExpenceReport=sequelize.define('ExpenceReport',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  expenceUrl:{
    type:Sequelize.STRING,
    allowNull:false
  }
});

module.exports=ExpenceReport;