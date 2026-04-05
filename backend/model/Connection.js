    const mongoose=require('mongoose');

    const ConnectionSchema=new mongoose.Schema({
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        status:{
            type:String,
              required:true,
            enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`,
        },
      
        }
        
    }, {
        timestamps: true,
    });

   ConnectionSchema.pre('save', async function () {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        throw new Error("Cannot send connection request to yourself");
    }
}); 

    const connection=mongoose.model("connection",ConnectionSchema);
    module.exports=connection;