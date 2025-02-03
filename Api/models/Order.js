const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  status: {
    type: String,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Each Order belongs to one User
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);



// const Sequelize=require('sequelize');

// const sequelize=require('../util/database');


// const Order=sequelize.define('order',{
//   id:{
//     type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
//   },
//   paymentId:Sequelize.STRING,
//   orderId:Sequelize.STRING,
//   status:Sequelize.STRING
// });

// module.exports=Order;