const ErrorHandler = require("../utils/errorHandler");

module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    //Wrong MongoDB ID Error
    if(err.name === "CastError"){
        const message = `Source not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    });
};