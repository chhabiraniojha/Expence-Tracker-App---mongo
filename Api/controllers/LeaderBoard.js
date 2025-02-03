const User = require('../models/User');
const Expence = require('../models/Expence');

exports.getLeaderBoard = async (req, res, next) => {
  const isPremium = req.user.isPremium;
  
  if (isPremium) {
    try {
      const response = await User.find().sort({ totalExpence: -1 });
      return res.status(200).json({ data: response });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(404).json({ data: "User is not premium" });
  }
};
