const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/User');

exports.purchasePremium = async (req, res, next) => {
   try {
      const rzp = new Razorpay({
         key_id: process.env.RAZORPAY_KEY_ID,
         key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      const amount = 2500;
      rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
         if (err) {
            console.log(err);
            return res.json({ error: `err: ${JSON.stringify(err)}` });
         }

         try {
            const newOrder = new Order({
               orderId: order.id,
               status: "PENDING",
               userId: req.user.id
            });

            await newOrder.save();
            return res.status(200).json({ order, key_id: rzp.key_id });
         } catch (error) {
            console.log(error);
            return res.json({ error: `error: ${JSON.stringify(error)}` });
         }
      });
   } catch (error) {
      console.log(error);
      return res.json({ error: `error: ${JSON.stringify(error)}` });
   }
};

exports.updateTransactionStatus = async (req, res) => {
   const { payment_id, order_id, status } = req.body;
   const id = req.user.id;
   
   try {
      const order = await Order.findOne({ orderId: order_id });

      if (order) {
         // Update order status
         order.paymentId = payment_id;
         order.status = status ? 'SUCCESS' : 'FAILED';
         await order.save();

         if (status) {
            const user = await User.findById(id);
            if (user) {
               user.isPremium = true;
               await user.save();
               return res.status(200).json({ success: true, message: 'Transaction successful' });
            }
         } else {
            return res.status(200).json({ success: true, message: 'Transaction failed' });
         }
      } else {
         return res.status(404).json({ error: 'Order not found' });
      }
   } catch (error) {
      console.log(error);
      return res.json({ error: `error: ${JSON.stringify(error)}` });
   }
};
