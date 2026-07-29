const express=require('express');
const AuthRouter=express.Router();
const User=require('../model/User');
const bcrypt=require('bcrypt');
const authMiddleware=require('../middleware/auth.middleware');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

AuthRouter.post('/signup', async (req, res) => {
    try {
        const bodyData = req.body;
        
        const passwordHash = await bcrypt.hash(bodyData.password, 10);
        bodyData.password = passwordHash;
        
        // Ensure leetcodeLink and githubLink are set (they can be empty strings)
        bodyData.leetcodeLink = bodyData.leetcodeLink || "";
        bodyData.githubLink = bodyData.githubLink || "";
        
        const data = new User(bodyData);
        await data.save();
        
        res.send("User created successfully");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

AuthRouter.post('/logout',authMiddleware, (req,res)=>{
   try{
     res.clearCookie("token");
    res.send("Logout successful");
   }
 catch(error){
    res.status(500).send("Failed to logout");
 }
});

AuthRouter.post('/login', async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("Email and password are required");
        }
        const user=await User.findOne({email});
        
        if(!user){
            return res.status(400).send("Invalid email or password");
        }
        
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).send("Invalid email or password");
        }
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET);
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
        });
       
        res.send(user);
    }
    catch(error){
        res.status(500).send("Invalid email or password");

    }
}); 


module.exports=AuthRouter;