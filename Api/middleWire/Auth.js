const Users = require('../models/User');
const jwt = require('jsonwebtoken');

const Authenticate = async (req, res, next) => {
    try {
        const token = req.header('authorization');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const { userId } = jwt.verify(token, process.env.SECRET_KEY);

        // Find user by _id in MongoDB
        const user = await Users.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error(error);
        res.status(501).json({ message: 'Authentication failed' });
    }
}

module.exports = Authenticate;
