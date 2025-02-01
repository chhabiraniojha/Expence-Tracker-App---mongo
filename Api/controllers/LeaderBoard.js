const User=require('../models/User');
const Expence=require('../models/Expence')

exports.getLeaderBoard=async (req,res,next)=>{
   const isPremium=req.user.isPremium;
   if(isPremium){
      try {
        const response=await  User.findAll({
         order:[['totalExpence','DESC']]
        })
        return res.status(200).json({data:response})
      } catch (error) {
         return res.json(error)
      }
   }else{
      return res.status(404).json({data:"user is not premium"})
   }

}