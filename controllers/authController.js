const { promisify } = require('util');
const User = require('./../models/userModels');
const jwt = require('jsonwebtoken');
const { route } = require('../app');
const sendEmail = require('./../utils/email');
const { fail } = require('assert');
const crypto = require('crypto')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRYDATE,
  });
};
const createSendToken = (user , statusCode , res) =>{
  const token = signToken(user._id);
    res.status(statusCode).json({
      status: 'success',
      token
    });
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });
    console.log(newUser);
    createSendToken(newUser , 201 , res );

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.login = async (req,res)=>{
  const {email , password} = req.body;
  //if email or password is not entered
  if(!email || !password){
      return res.status(400).json({
          status : "fail",
          message : "please enter email or password"
      })
  }
  //to check if user is existing or not
  const user = await User.findOne({email}).select("+password");
  console.log(user);
 
  if(!user || ! (user.correctPassword(password , user.password))){
      return res.status(400).json({
          status : "fail",
          message : "incorrect password or email"
      })
  }
  const token = (signToken(user._id));
  res.status(200).json({
  status : "success",
  token
});
}

  exports.protect = async (req, res, next) => {
    // 1) getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
  
    if (!token) {
      res.status(401).json({
        status: 'fail',
        message: 'you are not logged in!!Please login to get access',
      });
    }
  
    // 2) validation token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRETKEY);
    if (!decode) {
      return res.status(401).json({
        status: 'fail',
        message: 'invalid token',
      });
    }
    console.log(decode);
  
    // 3) check if user still exists
    const userExist = await User.findById(decode.id);
    if (!userExist) {
      return next(
        res.status(401).json({
          status: 'fail',
          message: 'user does not exist',
        })
      );
    }
  
    // 4) check if user changed password after getting token
    if (userExist.isPasswordChanged(decode.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'you have recently changed password, please login again',
      });
    }

    // 5) Allow user to access route
    req.user = userExist;
    next();
  };

exports.forgotPassword = async (req, res, next) => {
  // GET USER BASED ON POSTED EMAIL
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      res.status(401).json({
        status: 'fail',
        message: 'please provide correct email address',
      })
    );
  }
  // GENERATE A RANDOM RECENT TOKEN
  const resetToken = await user.createPasswordResetToken();
  // console.log(resetToken);
  await user.save({ validateBeforeSave: false });
  // SEND THE TOKEN BACK TO USER EMAIL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `We have received password reset request kindly use below link to reset password\n\n ${resetUrl}\n\n this link will be valid only for 10 minutes`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password change request',
      message: message,
    });
    res.status(200).json({
      status: 'success',
      message: 'password reset mail successfully sent to user',
    });
  } catch (error) {
    user.passwordResetToken = undefined,
    user.passwordResetTokenExpiresAt = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      res.status(401).json({
        status: 'fail',
        message:
          'There was an error sending password reset email , please try again!!',
      })
    );
  }
  next();
};

exports.resetPassword = async (req,res)=>{
    // CHECKING IF THE USER EXISTS WITH GIVEN TOKEN AND TOKEN HAS NOT EXPIRED
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken : token , passwordResetTokenExpiresAt : {$gt : Date.now()}});
    console.log(user);
    if(!user){
        return (res.status(400).json({
            status : "fail",
            message : "token is invalid or has expired"
        }))
    }

    // RESETTING THE USER PASSWORD
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.paswordResetTokenExpiresAt = undefined;
    user.passwordChangedAt = Date.now();
    user.save();

    // LOGIN USER
    createSendToken(user , 200 , res);
  }


exports.updatePassword = async (req,res)=>{
  //  GET USER FROM THE COLLECTION
    const user = await User.findById(req.user.id).select('+password');

//  CHECK IF POSTED PASSWORD IS CORRECTED
if(! user.correctPassword(req.body.passwordCurrent , user.password)){
  return res.status(401).json({
    status : "fail",
    message : "your current password is wrong"
  })
}
  // IF YES THEN UPDATE PASSWORD
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.save();
  // LOGIN USER
  createSendToken(user , 200 , res)
}
