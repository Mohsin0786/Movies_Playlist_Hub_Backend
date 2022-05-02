require('dotenv').config()
const jwt=require('jsonwebtoken');


exports.getResponseMessage=(statusCode,message)=>{
    return {
        statusCode,
        message
    }
}

exports.generateAccessToken=(payload,token_secret)=>{
    return jwt.sign(payload,token_secret,{expiresIn:'3600000s'});
}


