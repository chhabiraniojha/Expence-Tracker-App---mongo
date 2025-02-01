const express=require('express');
const userAuthentication=require('../middleWire/Auth')
const purchaseController=require('../controllers/Purchase')


const router=express.Router();


router.get('/premiummembership',userAuthentication,purchaseController.purchasePremium)
router.post('/updatetransactionstatus',userAuthentication,purchaseController.updateTransactionStatus)



module.exports=router