import mongoose from "mongoose";

//This Model is to Store the User's Balance
const availablecreditSchema = new mongoose.Schema({
    balance:{
        type:Number,
        default:0
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'peerfiveusers'
    }
},{
    timestamps:true
});

export default mongoose.model('availableCredit',availablecreditSchema)