import userController from '../controllers/user.controller.js'
import express from 'express'
import passport from 'passport'
import __ from '../../helpers/globalFunctins.js'
const router = express.Router()

router.post('/signup',userController.signupUser)
router.post('/login',userController.loginUser)

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

router.post('/updateProfile',userController.changeName)

export default router