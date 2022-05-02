const User = require('../models/auth')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const HttpStatus=require('http-status-codes');
const apiUtils=require('../utils/apiUtils')
const globalConstant=require('../utils/globalConstant');
require('dotenv').config()


//API for registering User
exports.signup = (req,res)=>{
    console.log("Inside signup API");
    User.findOne({email:req.body.email})  //finding user in db based on it email
    .then((user)=>{
  if(user){
      console.log("OOps user already registered");//User already exist then it return response that user already exist
      return res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponseMessage(HttpStatus.BAD_REQUEST,'User already exist'));
  }

//If user is not registered then new user will be created
  console.log("No user found creating new user");
  bcrypt.hash(req.body.password,globalConstant.SALT_ROUNDS) //hashing the user password using bcryptjs package
  .then((hash)=>{
      //After proper hashing information of new user is going to store in db
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
    });
    console.log("password hashed");
    console.log("Saving user Details");
    //Saving the user details
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
console.log("Sorry error occured: " + err); //If any error occurs a response will be sent of that error
res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiUtils.getResponseMessage(HttpStatus.INTERNAL_SERVER_ERROR,err.message));
    })
    
}


//APi for Logging user In
exports.signin = (req,res)=>{
    console.log("Inside signIn api")
    User.findOne({email:req.body.email}) //finding user in db based on it email
    .then((user)=>{
    if(!user){
        //If user doesn't exist return response that user not found
        return res.status(HttpStatus.UNAUTHORIZED).json(apiUtils.getResponseMessage(HttpStatus.UNAUTHORIZED,"User not found"))
    }
    //If user exist comparing the password provided with that stored in db
    bcrypt.compare(req.body.password,user.password)
     .then((valid)=>{
         if(!valid){
             return res.status(HttpStatus.UNAUTHORIZED).json(apiUtils.getResponseMessage(HttpStatus.UNAUTHORIZED,"Incorrect password"))
         }
         //If valid then  a response will be created and returned
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