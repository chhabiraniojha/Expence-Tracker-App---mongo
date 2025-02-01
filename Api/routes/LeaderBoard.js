const express =require('express');
const leaderBoardController=require('../controllers/LeaderBoard')
const authenticateUser=require('../middleWire/Auth')
const router=express.Router();


router.get('/',authenticateUser,leaderBoardController.getLeaderBoard)




module.exports=router;