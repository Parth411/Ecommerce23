const ErrorHandler = require("../utils/errorHandler");

module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    //Wrong MongoDB ID Error
    if(err.name === "CastError"){
        const message = `Source not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //Mongoose duplicate key rror
    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message,400);
    }

    //Wrong JWT Error
    if(err.name === "JsonWebTokenError"){
        const message = `JSON Web Token is Invalid, Try again!`;
        err = new ErrorHandler(message,400);
    }

    //JWT Expire Error
    if(err.name === "TokenExpiredError"){
        const message = `JSON Web Token is Expired, Try again!`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    });
};