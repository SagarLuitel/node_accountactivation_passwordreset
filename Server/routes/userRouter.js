const router = require('express').Router()
const env = require ('dotenv')
const user = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



router.post('/signin',async(req,res)=>{
    const {email,password} = req.body
    if(! await user.findOne({email})){
            if(!email || !password){
                return res.status(400).json({errormessage:"email cannot be blank"})
            }
        else if(password.length<8){
                return res.status(400).json({errormessage:"Password length must be minimum 8 characters"}) 
        }
        else{
            const salt = await bcrypt.genSalt()
            const newpassword = await bcrypt.hash(password, salt);
            user.create({email:email,password:newpassword})
            .then(success=>{
                const token = jwt.sign({user:success._id},process.env.JWT_Secrets)
                res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 });
                res.status(201).json(success._id );
                
            }).catch(err=>{
                res.status(400).json(err)
            })
            }
    }
    else
        res.status(400).json("user exists")
   
})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({errormessage:"Please enter required fields"})
    } 
    const existingUser = await user.findOne({email})
    if(!existingUser){
        return res.status(401).json({errormessage:"Username/Password Error"}) 
    }
    const checkPassword = await bcrypt.compare(password,existingUser.password)
        if(!checkPassword){
            return res.status(401).json({errormessage:"Username/Password Error"}) 
    }    
    const token = jwt.sign({user:existingUser._id},process.env.JWT_Secrets)
    res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 });
    res.status(201).json(existingUser._id ); 
})

router.get("/logout",(req,res)=>{
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');

})

module.exports = router;