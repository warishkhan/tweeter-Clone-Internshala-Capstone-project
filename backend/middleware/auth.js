const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  
  const {authorization} = req.headers;
    //Bearer 
    if(!authorization){
        return res.status(401).json({error: "User not logged in"});
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (error, payload)=>{
        if(error){
            return res.status(401).json({error: "User not logged in"});
        }
        const {id} = payload;
        User.findById(id)
        .then((dbUser)=>{
            req.user = dbUser;
            next();//goes to the next middleware or goes to the REST API
        })
    });
});

module.exports = isAuthenticatedUser;