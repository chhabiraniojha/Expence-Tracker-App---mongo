const Order = require('../models/Order');
const User = require('../models/User')
const Razorpay = require('razorpay')


exports.purchasePremium = async (req, res, next) => {

   try {
      const rzp = new Razorpay({
         key_id: process.env.RAZORPAY_KEY_ID,
         key_secret: process.env.RAZORPAY_KEY_SECRET
      })



      const amount = 2500;
      rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
         if (err) {
            console.log(err)
            return res.json(`err-JSON.stringify(${err})`)
         }

         try {
            await Order.create({ orderId: order.id, status: "PENDING", userId: req.user.id })
            return res.status(200).json({ order, key_id: rzp.key_id })
         } catch (error) {
            return res.json(err);

         }

      })
   } catch (error) {
      return res.json(error)
   }
}

exports.updateTransactionStatus = async (req, res, nextx) => {
   const { payment_id, order_id,status } = req.body;
   
   const id = req.user.id;
   try {
      if(status){
         await Order.update({ paymentId: payment_id, status: 'SUCCESS' }, {
            where: {
               orderId: order_id
            }
         });
         await User.update({ isPremium: true }, {
            where: {
               id: id
            }
         })
         return res.status(200).json({ success: true, message: 'transaction successfull' })
   
      }else{
         await Order.update({ paymentId: payment_id, status: 'FAILED' }, {
            where: {
               orderId: order_id
            }
         });
         return res.status(200).json({ success: true, message: 'transaction successfull' })
      }
      
   } catch (error) {

      return res.json(error);
   }

}