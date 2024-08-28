import mongoose from "mongoose";

//This is Where the User's Reward Information will be Stored
const rewardSchema = new mongoose.Schema({
    rewardedFrom:{
        type:mongoose.Schema.ObjectId,
        ref:'peerfiveusers'
    },
    rewardTo:{
        type:mongoose.Schema.ObjectId,
        ref:'peerfiveusers'
    },
    amount:{
        type:Number,
        default:0
    },
    transactionId:{
        type:mongoose.Schema.ObjectId,
        ref:'transaction'
    },
    isReversed:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

export default mongoose.model('reward',rewardSchema)