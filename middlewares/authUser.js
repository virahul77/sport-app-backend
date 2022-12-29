const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const authUser = asyncHandler(async (req,res,next) => {
    try {
        const {token} = req.headers;
        if(!token) {
            return res.status(400).json({msg:'please provide token'});
        }
        const verify = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!verify) {
            return res.status(400).json({msg:'invalid or expired token'});
        }
        const user = await User.findById(verify.id);
        if(!user){
            return res.status(404).json({msg:'user not found'});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({error:error.message});
    }  
})

module.exports = authUser;