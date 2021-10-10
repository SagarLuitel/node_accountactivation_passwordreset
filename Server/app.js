const express = require ('express');
const app = express();
const mongoose = require ('mongoose')
const env = require ('dotenv')
const user = require('./models/user')
const userRouter = require('./routes/userRouter');
const cookieParser = require('cookie-parser');
const {requireAuth} = require('./middleware/authMIddleware')

env.config();
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.Database_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(data=>{app.listen(4040)})
    .catch(err=>{console.log("db connection failed")})

app.get('/',(req,res)=>{
    res.json("welcome to Landing Page, Please sign in")
})

app.get('/welcome', requireAuth, (req,res)=>{
    res.json("welcome you have successfully logged in")
})

app.use('/user',userRouter)