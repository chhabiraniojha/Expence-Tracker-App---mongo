const express=require('express');
const expenceController=require('../controllers/Expence')
const userAuthentication=require('../middleWire/Auth')

const router=express.Router();

router.post('/addExpence',userAuthentication,expenceController.addExpence)
router.get('/',userAuthentication,expenceController.getExpence)
router.delete('/:id',userAuthentication,expenceController.deleteExpence)
router.get('/pagination',userAuthentication,expenceController.getPaginatedExpence)
router.get("/download",userAuthentication,expenceController.downloadExpences)
router.get("/downloadedreports",userAuthentication,expenceController.showReports )


module.exports=router;