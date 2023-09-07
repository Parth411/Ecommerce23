const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

//Register a User
exports.registerUser = catchAsyncError (async(req,res,next)=> {
    
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is sample Id",
            url:"profileUrl"
        }
    });

    sendToken(user,201,res);
})

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
   sendToken(user,200,res);
  });

// Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Forgot password

exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
  
  const user = await User.findOne({email:req.body.email});

  if(!user) {
    return next(new ErrorHandler("User not Found", 404));
  }

  //Get resetPassword Token

  const resetToken = user.getResetPasswordToken();

  await user.save({validateBeforeSave: false});

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset Token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email 
                   then please ignore it`;

  try {

    await sendEmail({
      email:user.email,
      subject: `Ecommerece Password Recovery`,
      message,

    });

    res.status(200).json({
      success:true,
      message:`Email sent to ${user.email} successfully`,
    });
    
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave: false});

    return next(new ErrorHandler(error.message, 500));

  }


});

//Reset Password
exports.resetPassword = catchAsyncError(async(req,res,next)=>{

//Creating token Hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt: Date.now() },

  });
  if(!user) {
    return next(new ErrorHandler("Reset password token is Invalid or has been expired", 404));
  }

  if(req.body.password !== req.confirmPassword){
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password ;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
})