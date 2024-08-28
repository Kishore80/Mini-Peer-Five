import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import PeerfiveUsers from '../models/peerfiveusers.model.js';
import PeerfiveAvailableCredit from '../models/availablecredit.model.js';

import __ from '../../helpers/globalFunctins.js';

dotenv.configDotenv()

class users{
    //This is a Sign Up API
    signupUser = async(req,res)=>{
        try {
            //Check if the User already has Account and Proceed only if account doesn't exists
            let existingUserCheck = await PeerfiveUsers.findOne({
                email:req.body.email
            }).lean();
            if(existingUserCheck){
                return __.out(res,400,`An Account with email ${req.body.email} already exists ,Please Login using that account`)
            }else{
                let createObject = {
                    name:req.body.name,
                    email:req.body.email,
                    password:bcrypt.hashSync(req.body.password,12) //Hash the Password instead of Storing in Raw Format
                }
                
                //Create a User
                let createUser = await PeerfiveUsers.create(createObject);

                let createCredit = {
                    userId : createUser._id , 
                    balance : process.env.DEFAULT_CREDIT_AMOUNT
                }
                //At the Same time We create a Credit Account for the User when Signing Up , 
                //This could differ as per the Business Requirement , 
                //But to Simplify the details I am assuming this is a Bonus Amount during Sign UP
                await PeerfiveAvailableCredit.create(createCredit);
                return __.out(res,200,{
                    message:`Your Account with email ${createObject.email} has been Created. Please proceed to Login`
                })
            }
        } catch (error) {
            console.log("ERROR",error)
            return __.out(res,500,"Internal Server Error")
        }
    }
    //Login User API
    loginUser = async(req,res)=>{
        try {
            let findExistingUser = await PeerfiveUsers.findOne({
                email:req.body.email
            })
            //Validation Takes Place to ensure the Account exists
            if(!findExistingUser){
                return __.out(res,400,"Please Create an Account using this email to login")
            }else{
                let verifyPwd = bcrypt.compareSync(req.body.password,findExistingUser.password);
                if(!verifyPwd){//Password Validation
                    return __.out(res,400,"Invalid Password")
                }else{
                    //For Authentication , Using JWT Strategy
                    let createJwtToken = jwt.sign({
                        userId:findExistingUser._id,
                        email:findExistingUser.email
                    },process.env.JWT_KEY); 

                    return __.out(res,200,{
                        message:"Login Successful",
                        data:`Bearer ${createJwtToken}`
                    })
                }
            }
        } catch (error) {
            console.log("ERROR",error)
            return __.out(res,500,"Internal Server Error")
        }
    }
    //Assuming there will be a Profile Section to display the User Information , Where a User will be allowed to Edit his information
    //The Below API supports Name Update , When we implement other features , We can allow user to update other information
    changeName = async(req,res)=>{
        try {
            let updateProfile = await PeerfiveUsers.updateOne({
                _id:req.user.userId
            },{
                $set:{
                    name:req.body.name
                }
            })
            return __.out(res,200,{
                message:"Your Profile Update is Successful"
            })
        } catch (error) {
            return  __.out(res,500,"Internel Server Error")
        }
    }
}

users = new users()
export default users;