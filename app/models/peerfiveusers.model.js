import mongoose from "mongoose";

//This is the Root Table for our Application where it will hold User Information
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    }
},{
    timestamps:true
});


export default mongoose.model('peerfiveusers',userSchema)