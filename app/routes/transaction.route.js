import creditController from '../controllers/credit.controller.js'
import express from 'express'
import passport from 'passport'
import __ from '../../helpers/globalFunctins.js'
const router = express.Router()

router.use(passport.authenticate('jwt',{
    session:false
}),
    (req,res,next)=>{
        console.log("req.user",req.user)
        if(req.user){
            next();
        }else{
            return __.out(res,401,"Unauthorized")
        }
    }
)

router.post('/transfer',creditController.transfer)
router.post('/delete',creditController.reverseP5Transaction)
router.post('/view',creditController.listingMyTransactions)
router.post('/viewOne',creditController.viewATransaction)


export default router