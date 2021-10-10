const jwt = require ("jsonwebtoken")

const requireAuth = (req,res,next) =>{
   const token = req.cookies.jwt

    if(!token){
        res.redirect("/")
    }
    else{
        jwt.verify(token,env.process.JWT_Secrets,(err,decodedToken)=>{
            if(err){
                console.log(err.message)
                res.redirect('/')
            }
            else{
                console.log(decodedToken)
                next();
            }
        })
    }
}

module.exports = {requireAuth}