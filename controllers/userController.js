const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const genToken = (id)=> {
    const token = jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:'3d'});
    return token;
}
const registerUser = asyncHandler(async (req,res)=> {
    try {
        const {username,password} = req.body;
        if(!username || !password) {
            return res.status(400).json({msg:"please provide username and password"});
        }
        const hashPass = await bcrypt.hash(password,10);
        const user = await User.create({username,password:hashPass});
        const token = genToken(user._id);
        res.status(201).json({user,token});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

const loginUser = asyncHandler(async (req,res)=> {
    try {
        const {username,password} = req.body;
        if(!username || !password) {
            return res.status(400).json({msg:"please provide username and password"});
        }
        const user = await User.findOne({username});
        if(!user) {
            return res.status(404).json({msg:'username not registered'});
        }
        const compare = await bcrypt.compare(password,user.password);
        if(!compare) {
            return res.status(400).json({msg:'invalid password'});
        }
        const token = genToken(user._id);
        return res.status(200).json({user,token});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

module.exports = {registerUser,loginUser};