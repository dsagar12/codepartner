const authMiddleware=require('../middleware/auth.middleware');
const express=require('express');
const User=require('../model/User');
const profileRouter=express.Router();
profileRouter.use(express.json());
const bcrypt=require("bcrypt");
const connection=require('../model/Connection');
profileRouter.delete("/delete", authMiddleware, async (req,res)=>{
    try{
        const user=req.user;
        await User.findByIdAndDelete(user._id);
        res.clearCookie("token");
        res.send("Profile deleted successfully");
    }catch(error){
        res.status(500).send("Failed to delete profile");
    }
});

// GET user by id
profileRouter.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email about photoURL skills createdAt"
    );

    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.patch("/change-password", authMiddleware, async (req,res)=>{
    try{
        const {oldPassword,newPassword}=req.body;   
        if(!oldPassword || !newPassword){
            return res.status(400).send("Old password and new password are required");
        }
       
        const user=req.user;
        const isMatch=await bcrypt.compare(oldPassword,user.password);
        if(!isMatch){
            return res.status(400).send("Old password is incorrect");
        }
        const newPasswordHash=await bcrypt.hash(newPassword,10);
        user.password=newPasswordHash;
        await user.save();
        res.send("Password changed successfully");
    }catch(error){
        res.status(500).send("Failed to change password");
    }   
});


profileRouter.get("/profile", authMiddleware, async (req,res)=>{
    try{
 res.json(req.user);
    }catch(error){
        res.status(500).send("Failed to fetch profile");
    }
       
})


profileRouter.get("/search", authMiddleware, async (req, res) => {
  try {
    const { skill } = req.query;

    if (!skill) {
      return res.status(400).send("Skill query parameter is required");
    }

    const skillArray = skill.split(",");

    const connections = await connection.find({
      $or: [
        { fromUserId: req.user._id },
        { toUserId: req.user._id }
      ]
    });

    const hiddenUsers = connections.map(conn => {
      if (conn.fromUserId.toString() === req.user._id.toString()) {
        return conn.toUserId;
      }
      return conn.fromUserId;
    });

    const users = await User.find({
      _id: { $nin: [...hiddenUsers, req.user._id] }, 
      skills: {
        $elemMatch: {
          $regex: skillArray.join("|"), 
          $options: "i"
        }
      }
    });

    res.json({
      message: "Users fetched successfully",
      count: users.length,
      users
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});


profileRouter.patch("/edit", authMiddleware, async (req,res)=>{
    try{
        const bodyData=req.body;
        const AllowedData=["name","about","photoURL","skills"];
        const isValidData=Object.keys(bodyData).every(key=>AllowedData.includes(key));
        if(!isValidData){
            return res.status(400).send("Invalid data");
        }
        const user=req.user;
        Object.keys(bodyData).forEach(key=>{
            user[key]=bodyData[key];
        })
        await user.save();
        res.json(user);
    }catch(error){
        res.status(500).send("Failed to update profile");
    
    }
})


module.exports=profileRouter;