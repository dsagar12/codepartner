const express=require('express');
const User=require('../model/User');
const jwt=require('jsonwebtoken');

const authMiddleware=async (req,res,next)=>{
    try{
        const token=req.cookies.token;
    if(!token){
        return res.status(401).send("Unauthorized");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if(!user){
        return res.status(401).send("Unauthorized");
    }
    req.user=user;

    next();
    }
    catch(error){
        res.status(401).send("Unauthorized");
    }
}

module.exports = authMiddleware;