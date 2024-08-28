import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import PeerfiveUsers from '../models/peerfiveusers.model.js';
import AvailableCredit from '../models/availablecredit.model.js';
import Transaction from '../models/transaction.model.js';
import RewardCredit from '../models/reward.model.js';

import __ from '../../helpers/globalFunctins.js';

dotenv.configDotenv()

class credit{
    //This API is to Transfer the P5 Amount from One to Another
    transfer = async(req,res)=>{
        try {
            //First Validation is to Check the Balance and Proceed only if sufficient
            let checkSufficientBalance = await AvailableCredit.findOne({
                userId:req.user.userId
            })
            //The following validation is to ensure Data Integrity that a user cannot transfer to self
            if(req.body.toId == req.user.userId){
                return __.out(res,400,"Sorry you are not allowed to perform this transaction")
            }
            //Checks the Balance Validation as mentioned above
            if(req.body.transferCredit > checkSufficientBalance.balance){
                return __.out(res,400,"Sorry you don't have sufficient credit to perform this transaction")
            }else{
                //After Successful Validation , First We deduct the Balance from Source User
                let deductBalance = await AvailableCredit.updateOne({
                    userId:req.user.userId
                },{
                    $set:{
                        balance:checkSufficientBalance.balance - req.body.transferCredit
                    }
                })

                //Create the Transaction Entry
                let createTransaction = await Transaction.create({
                    amount:req.body.transferCredit,
                    fromId:req.user.userId,
                    toId:req.body.toId //Assuming this To ID will be a Genuine ID where Frontend will retrieve it from List of Users 
                })

                //Credit Reward and Create a Reward Entry
                let createReward = await RewardCredit.create({
                    rewardedFrom:req.user.userId,
                    rewardTo:req.body.toId,
                    amount:req.body.transferCredit,
                    isReversed:0,
                    transactionId:createTransaction._id //Assuming this To ID will be a Genuine ID where Frontend will retrieve it from List of Users 
                })
                return  __.out(res,200,"Your P5 Credit is Successful")
            } 
        } catch (error) {
            console.log("ERROR",error)
            return __.out(res,500,"Internal Server Error")
        }
    }
    reverseP5Transaction = async(req,res)=>{
        try {

            //Update the Reward to Indicate it is Reversed
            let deductBalance = await RewardCredit.updateOne({
                transactionId:req.body.transactionId
            },{
                $set:{
                    isReversed:1
                    // amount:0  - Reason of not updating the Amount to 0 is because , If we have to display the Transaction Amount in UI , then We might need it 
                }
            })

            //Update the Transaction Record as well
            let findTransactionInfo = await Transaction.findOne({
                _id:req.body.transactionId
            })

            let updateTransaction = await Transaction.updateOne({
                _id:req.body.transactionId
            },{
                $set:{
                    isReversed:1,
                    // amount:0 - Reason of not updating the Amount to 0 is because , If we have to display the Transaction Amount in UI , then We might need it  
                }
            })

            //We need to find the Current Balance as to Credit it back to the Source User
            let currentBalance = await AvailableCredit.findOne({
                userId:req.user.userId
            })

            //Credit the Balance to the Source User
            let findUser = await AvailableCredit.updateOne({
                userId:req.user.userId
            },{
                $set:{
                    balance:currentBalance.balance + findTransactionInfo.amount
                }
            })

            return __.out(res,200,'Your Transaction is Deleted Successfully')
        } catch (error) {
            console.log("ERROR",error)
            return __.out(res,500,"Internal Server Error")
        }
    }
    //This Listing will be required in the Frontend while a User can view the transactions done by self and can initiate Delete Transaction when required
    listingMyTransactions = async(req,res)=>{
        try{
            //Listing in Latest First Sort Order
            let findAllMyTransactions = await Transaction.find({
                fromId:req.user.userId
            }).sort({ updatedAt: -1 })
            return __.out(res,200,findAllMyTransactions)
        }catch(error){
            console.log("ERROR",error)
            return __.out(res,500,"Internal Server Error")
        }
    }
    //This is to View a Individual Transaction in the UI , When a user requires to View the Detailed Transaction information as to Target User , This API can be used in those situations
    viewATransaction = async(req,res)=>{
        try{
            //Listing in Latest First Sort Order
            let viewTransaction = await Transaction.findOne({
                _id:req.body.transactionId
            })
            .populate({
                path: 'fromId',
                select: 'name'
            })
            .populate({
                path: 'toId',
                select: 'name'
            })
            return __.out(res,200,viewTransaction)
        }catch(error){
            console.log("ERROR",error)
            return __.out(res,500,"Internal Server Error")
        }
    }
}

credit = new credit()
export default credit;