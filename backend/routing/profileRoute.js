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
      "name email about photoURL skills createdAt leetcodeLink githubLink"
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


profileRouter.get("/search", async (req, res) => {
  const { query } = req.query;

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { skills: { $regex: query, $options: "i" } },
    ],
  }).select("name photoURL skills");

  res.json({ users });
});

profileRouter.patch("/edit", authMiddleware, async (req,res)=>{
    try{
        const bodyData=req.body;
        const AllowedData=["name","about","photoURL","skills","leetcodeLink","githubLink"];
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