const mongoose = require('mongoose');

const expenceSchema = new mongoose.Schema({
  expenceAmount: {
    type: Number,
    required: true,
  },
  expenceDescription: {
    type: String,
    required: true,
  },
  expenceCategory: {
    type: String,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Each Expence belongs to one User
}, { timestamps: true });

module.exports = mongoose.model('Expence', expenceSchema);




// const Sequelize=require('sequelize');

// const sequelize=require('../util/database');


// const Expence=sequelize.define('Expence',{
//   id:{
//     type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
//   },
//   expenceAmount:{
//     type:Sequelize.INTEGER,
//     allowNull:false
//   },
//   expenceDescription:{
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   expenceCategory:{
//     type:Sequelize.STRING,
//     allowNull:false
//   }
// });

// module.exports=Expence;