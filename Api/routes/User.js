const express=require("express");
const userController=require("../controllers/User");
const userAuthentication=require("../middleWire/Auth")


const router=express.Router();


router.post("/signup",userController.signup)
router.post('/signin',userController.signin)
router.get("/:email",userController.getUser)
router.get("/",userAuthentication,userController.getUserInfo)


module.exports=router;