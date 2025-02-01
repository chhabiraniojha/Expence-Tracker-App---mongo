const express=require('express');
const passwordController=require('../controllers/Password')
const router=express.Router();

router.post('/forgotpassword',passwordController.forgotPassword)
router.get('/resetpassword/:id/:token',passwordController.resetPassword)
router.post('/updatepassword/:id/:token', passwordController.updatePassword)

module.exports=router;