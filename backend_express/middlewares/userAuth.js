const jwt = require('jsonwebtoken');
const User = require("../models/user.model.js");
require("dotenv").config();

const userAuth = async (req,res,next) => {
    try {

        const authHead = req.header("Authorization");
        if(!authHead) {
            return res.status(401).json({message:"Authprization heaader missing"})
        }

        const token = authHead.split(" ")[1];
        if(!token) {
            return res.status(401).json({message:"token missing"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id)
        if(!user) {
            return res.status(401).json({message:"Unauthorised,user not found"})
        }
        req.user = user;
        next();
    }
    catch(error) {
        return res.status(401).json({message:"Unauthorised , invalid token"})
    }
}

module.exports = userAuth;