import  JsonWebToken  from "jsonwebtoken";

const isLoggedIn = (req, res, next)=>{
    try{
    if(!req.headers.authorization){
        return res.status(400).json({message: "لم يتوفر رمز تحقق"})
    }
    const token = req.headers.authorization.split(" ")[1]
    const decode = JsonWebToken.verify(token, process.env.JWT_SECRET)
    req.currentUser = decode
    next()
}
catch(err){
    res.json(err.message)
}
}

export default isLoggedIn