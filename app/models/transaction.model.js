import mongoose from "mongoose";

//This is where the Transactions Information will be Stored in this Collection
const transactionSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    fromId:{
        type:mongoose.Schema.ObjectId,
        ref:'peerfiveusers'
    },
    toId:{
        type:mongoose.Schema.ObjectId,
        ref:'peerfiveusers'
    },
    isP5transaction:{
        type:Number,
        default:1
    },
    isReversed:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});


export default mongoose.model('transactions',transactionSchema)
