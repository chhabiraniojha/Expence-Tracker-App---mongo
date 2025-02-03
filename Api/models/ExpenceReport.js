const mongoose = require('mongoose');

const expenceReportSchema = new mongoose.Schema({
  expenceUrl: {
    type: String,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Each ExpenceReport belongs to one User
}, { timestamps: true });

module.exports = mongoose.model('ExpenceReport', expenceReportSchema);





// const Sequelize=require('sequelize');

// const sequelize=require('../util/database');


// const ExpenceReport=sequelize.define('ExpenceReport',{
//   id:{
//     type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
//   },
//   expenceUrl:{
//     type:Sequelize.STRING,
//     allowNull:false
//   }
// });

// module.exports=ExpenceReport;