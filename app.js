import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRouter from './app/routes/user.route.js'
import creditRouter from './app/routes/transaction.route.js'
import passport from 'passport'
dotenv.configDotenv()

const app = express()

mongoose.connect(process.env.DB_HOST)
.then(()=>{
    console.log("DB Connected")
    app.listen(process.env.PORT,()=>{
        console.log(process.env.PORT)
        console.log("Express Server Setup Done")
    })
})
.catch(()=>{
    console.log("DB Connection Failed")
    process.exit()
});

//Tells our app to receive JSON requests 
app.use(express.json())
app.use(passport.initialize())



import './helpers/jwtAuthenticator.js'
//Router and it's Root Path
app.use('/user',userRouter);
app.use('/credit',creditRouter);