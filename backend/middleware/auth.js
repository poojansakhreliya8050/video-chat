const jwt=require("jsonwebtoken");
const User = require('../models/user.model');

const userAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send('Please authenticate');
        }
        const userId = jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findOne({ _id: userId });

        if (!user) {
            return res.status(401).send('Please authenticate');
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send('Please authenticate');
    }
}

module.exports = {userAuth};