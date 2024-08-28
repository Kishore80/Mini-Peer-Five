//This File Acts as a Middleware to verify the JWT Token of Every Incoming Request
//If Role Based Authentication , Those Conditions need to be handled as well.

import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'; //Using Passport JWT Strategy For this Authentication
import PeerfiveUsers from '../app/models/peerfiveusers.model.js' //Since User Table is the Root Table of our Database , We use it to Authenticate
import __ from './globalFunctins.js'
import dotenv from 'dotenv'
import mongoose from "mongoose";

dotenv.config()

//The Passport JWT Strategy Requires 2 Steps
//1. Extract the Token from Header
//2. Use Secret Key to Decode the Token
const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_KEY
}
//We are using Passport JWT Strategy
 passport.use(new JwtStrategy(options ,async (jwtPayload,done)=>{
    //This Query is to Find if a User Exist in the Database with the respective userId
    PeerfiveUsers.findOne({
        _id:jwtPayload.userId
    })
    .then(user => {
        if(!user){
            //If User Doesn't Exist , Return False , It says , The Authentication is Failed
            return done(null ,false)
        }else{
            let userObj = {
                email:user.email,
                userId:user._id
            }
            user = userObj
            //The user define , is sent over as req.user in the subsequent requests.
            return done(null, user) //If User Exist , Authentication Successful
        }
    })
    .catch(error =>{
        console.log("Authentication Error",error)
        return done(error,false);//This is Common Authentication Error
    })
}))