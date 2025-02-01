const Sequelize=require('sequelize');

const sequelize=require('../util/database');


const Expence=sequelize.define('Expence',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  expenceAmount:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  expenceDescription:{
    type:Sequelize.STRING,
    allowNull:false
  },
  expenceCategory:{
    type:Sequelize.STRING,
    allowNull:false
  }
});

module.exports=Expence;