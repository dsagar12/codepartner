const express=require('express');
const ConnectionRouter=express.Router();
const connection=require('../model/Connection');
const authMiddleware=require('../middleware/auth.middleware');
const User=require('../model/User');



ConnectionRouter.get("/requests/sent", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await connection.find({
      fromUserId: userId,
      status: "interested"
    }).populate("toUserId", "name email photoURL skills");

    const data = requests.map(req => ({
      requestId: req._id,
      user: req.toUserId
    }));

    res.json({
      message: "Sent requests fetched",
      users: data
    });

  } catch (error) {
    res.status(500).send("Error " + error.message);
  }
});


ConnectionRouter.get("/requests/received", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await connection.find({
      toUserId: userId,
      status: "interested"
    }).populate("fromUserId", "name email photoURL skills");

    // ✅ Proper structure (requestId + user)
    const data = requests.map(req => ({
      requestId: req._id,       // 🔥 VERY IMPORTANT
      user: req.fromUserId      // actual user data
    }));

    res.json({
      message: "Incoming requests fetched",
      users: data
    });

  } catch (error) {
    res.status(500).send("Error " + error.message);
  }
});


ConnectionRouter.post("/request/send/:status/:toUserId", authMiddleware, async (req,res)=>{
    try{
        const fromUserId=req.user._id;
        const {status,toUserId}=req.params;
       
        const allowedStatus=["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid status");
        }

       
        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send("User not found");
        }
       
        const exisitingConnection=await connection.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        });
        if(exisitingConnection){
            return res.status(400).send("Connection request already exists");
        }

        const connectionRequest=new connection({
            fromUserId,
            toUserId,
            status,
        }); 
        console.log("me yaha to aaya  tha");
        console.log(connectionRequest);
       const dat= await connectionRequest.save();
       console.log(dat);
         res.send("Connection request sent successfully");
    }
    catch(error){
        res.status(500).send(error.message);
    }
    })


    ConnectionRouter.get("/feed", authMiddleware, async (req,res)=>{
        try{
            const USER_SAFE_DATA = "name email about photoURL skills";
           const loggedInUser=req.user;
           const page=parseInt(req.query.page) || 1;
           let limit=parseInt(req.query.limit) || 10;
           limit=limit>50?50:limit;
              const skip=(page-1)*limit;
              const connectionRequests=await connection.find({
                $or:[
                    {fromUserId:loggedInUser._id},
                    {toUserId:loggedInUser._id}
                ],
              }).select("fromUserId toUserId");

              const hideUserFromFeed=new Set();
                connectionRequests.forEach(request=>{
                    hideUserFromFeed.add(request.fromUserId.toString());
                    hideUserFromFeed.add(request.toUserId.toString());
                });
                const users=await User.find({
                $and:[
                    {_id:{$nin:Array.from(hideUserFromFeed)}},
                    {_id:{$ne:loggedInUser._id}}
                ],
            }).select(USER_SAFE_DATA).skip(skip).limit(limit);
            res.json(users);
        }
        catch(error){
            res.status(500).send("Error"+error.message);
        }
    });



    ConnectionRouter.post("/request/review/:status/:requestId", authMiddleware, async (req,res)=>{
        try{
            const loogedInUser=req.user;
            const {status,requestId}=req.params;
            const allowedStatus=["accepted", "rejected"];
            if(!allowedStatus.includes(status)){
                return res.status(400).send("Invalid status");
            }
            const connectionRequest=await connection.findOne({_id:requestId, toUserId:loogedInUser._id,status:"interested"});
            if(!connectionRequest){
                return res.status(404).send("Connection request not found");
            }
            connectionRequest.status=status;
            const data=await connectionRequest.save();
            res.json({message:"connection request"+status,data});
        }
        catch(error){
            res.status(400).send("Error"+error.message);
        }
    })

    ConnectionRouter.get("/list", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await connection.find({
      status: "accepted",
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    });

    const userSet = new Set();

    connections.forEach(conn => {
      userSet.add(conn.fromUserId.toString());
      userSet.add(conn.toUserId.toString());
    });

    userSet.delete(userId.toString());

    const userIds = Array.from(userSet);

    const users = await User.find({
      _id: { $in: userIds }
    }).select("name email photoURL skills");

    res.json({
      message: "Connections fetched successfully ",
      users
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

ConnectionRouter.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const userSkills = req.user.skills;

    const connections = await connection.find({
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    });

    const hiddenUsers = connections.map(conn => {
      if (conn.fromUserId.toString() === userId.toString()) {
        return conn.toUserId;
      }
      return conn.fromUserId;
    });

    const users = await User.find({
      _id: { $nin: [...hiddenUsers, userId] },
      skills: { $in: userSkills }
    });

    const scoredUsers = users.map(user => {
      const commonSkills = user.skills.filter(skill =>
        userSkills.includes(skill)
      );

      return {
        user,
        score: commonSkills.length 
      };
    });

    scoredUsers.sort((a, b) => b.score - a.score);

    const result = scoredUsers.map(item => item.user);

    res.json({
      message: "Recommended users fetched",
      users: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});
    module.exports=ConnectionRouter;