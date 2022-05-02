const User = require('../models/auth')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const HttpStatus=require('http-status-codes');
const apiUtils=require('../utils/apiUtils')
const globalConstant=require('../utils/globalConstant');
require('dotenv').config()
exports.signup = (req,res)=>{
    console.log("Inside signup API");
    User.findOne({email:req.body.email})
    .then((user)=>{
  if(user){
      console.log("OOps user already registered");
      return res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponseMessage(HttpStatus.BAD_REQUEST,'User already exist'));
  }

  console.log("No user found creating new user");
  bcrypt.hash(req.body.password,globalConstant.SALT_ROUNDS)
  .then((hash)=>{

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
    });
    console.log("password hashed");
    console.log("Saving user Details");
    user.save().then(()=>{
        console.log("User saved succesfully");
        res.status(HttpStatus.CREATED).json(apiUtils.getResponseMessage(HttpStatus.CREATED,'user created succesfully'));

    })
    .catch((err)=>{
        console.log("sorry Error occured: " + err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiUtils.getResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR,err.message));
    })
  })
    })
    .catch((err)=>{
console.log("Sorry error occured: " + err);
res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiUtils.getResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR,err.message));
    })
    
}

exports.signin = (req,res)=>{
    console.log("Inside signIn api")
    User.findOne({email:req.body.email})
    .then((user)=>{
    if(!user){
        return res.status(HttpStatus.UNAUTHORIZED).json(apiUtils.getResponseMessage(HttpStatus.UNAUTHORIZED,"User not found"))
    }
    bcrypt.compare(req.body.password,user.password)
     .then((valid)=>{
         if(!valid){
             return res.status(HttpStatus.UNAUTHORIZED).json(apiUtils.getResponseMessage(HttpStatus.UNAUTHORIZED,"Incorrect password"))
         }
         console.log("password matched, generating token");
         const token = apiUtils.generateAccessToken({userId:user._id},process.env.TOKEN_SECRET)
         const loginResponse=apiUtils.getResponseMessage(HttpStatus.OK,'logged in successfully');
         loginResponse['token']=token;
         loginResponse['firstName']=user.firstName;
         loginResponse['userId']=user._id;
             res.status(HttpStatus.OK).json(loginResponse);
    })
     .catch((err)=>{
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiUtils.getResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR,err.message))
    })

}).catch((err)=>{
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiUtils.getResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR,err.message))
    })
   
   
    }