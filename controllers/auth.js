import asyncHandler from 'express-async-handler';
import sharp from 'sharp';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { sendEmail } from '../utils/sendEmail.js';
import { generateHash } from '../utils/generateHash.js';

// @ desc   Login User & Get Token
// @ route  POST /api/v1/auth/login
// @ access Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;
  
  if(!email || !password){
    return next(new ErrorResponse(400, 'Please provide an email and password'));
  }
  
  const user = await User.findOne({email}).select('+password');
  
  if(!user || !(await user.matchPassword(password))){
    return next(new ErrorResponse(401, 'Invalid Email or Password!')); 
  }
  
  sendTokenResponse(user, 200, res);
});

// @ desc   Register a New User
// @ route  POST /api/v1/auth/register
// @ access Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const {name, email, password} = req.body;
  
  let user = new User({name, email, password});
  user = await user.save();
  
  sendTokenResponse(user, 201, res);
});

// @ desc   Get Logged In User
// @ route  GET /api/v1/auth/me
// @ access Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = req.user.toObject();
  delete user.photo;

  return res.status(200).json({
    success: true,
    data: user
  });
});

// @ desc   Update Logged In User Fields
// @ route  PUT /api/v1/auth/me/details
// @ access Private
export const updateMyDetails = asyncHandler(async (req, res, next) => {
  const {name, email} = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, {name, email}, {
    new: true,
    runValidators: true
  });

  return res.status(200).json({
    success: true,
    data: user
  });
});

// @ desc   Update Logged In User Password
// @ route  PUT /api/v1/auth/me/password
// @ access Private
export const updateMyPassword = asyncHandler(async (req, res, next) => {
  const {currentPassword, newPassword} = req.body;

  if(!currentPassword || !newPassword){
    return next(new ErrorResponse(400, 'Please provide your current password and the new password'));
  }

  let user = await User.findById(req.user._id).select('+password');

  if(!await user.matchPassword(currentPassword)){
    return next(new ErrorResponse(400, 'Password is incorrect'));
  }

  user.password = newPassword || user.password;
  user = await user.save({validateBeforeSave: false}); 
  
  sendTokenResponse(user, 200, res);
});

// @ desc   Get Logged In User Photo
// @ route  GET /api/v1/auth/me/photo
// @ access Private
export const getMyPhoto = asyncHandler(async (req, res, next) => {  
  if(!req.user.photo){
    return next(new ErrorResponse(404, 'No photo found for your profile'));
  }

  res.set('Content-Type', 'image/png');
  res.send(req.user.photo);
});

// @ desc   Upload Logged In User Photo
// @ route  PUT /api/v1/auth/me/photo
// @ access Private
export const uploadMyPhoto = asyncHandler(async (req, res, next) => {  
  const user = req.user;

  if(req.file){
    user.photo = await sharp(req.file.buffer)
      .png()
      .resize({
        width: 250,
        height: 250
      })
      .toBuffer();
    await user.save({validateBeforeSave: false});
  
    res.status(200).json({
        success: true,
        data: {}
    });
  }else{
    next(new ErrorResponse(500, 'Something went wrong'));
  }
});

// @ desc   Forgot Password
// @ route  POST /api/v1/auth/forgotPassword
// @ access Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  if(!req.body.email){
    return next(new ErrorResponse(400, 'Please provide your email'));
  }

  const user = await User.findOne({email: req.body.email});
  
  if(!user){
    return next(new ErrorResponse(404, `User with email ${req.body.email} not found`));
  }
  
  const resetToken = user.prepareResetPasswordToken();
  await user.save({validateBeforeSave: false});

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) have requested the
  reset of password. Please make a PUT request to: \n\n ${resetUrl}`;
  
  try{
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message: message
    });

    return res.status(200).json({
      success: true,
      data: {}
    });
  }catch(err){
    console.log(err);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave: false});

    return next(new ErrorResponse(500, 'Email could not be sent'));
  }
});

// @ desc   Reset Password
// @ route  PUT /api/v1/auth/resetPassword/:resetToken
// @ access Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  if(!req.body.password){
    return next(new ErrorResponse(400, `Please provide a password`));
  }

  const resetPasswordToken = generateHash(req.params.resetToken);
  
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if(!user){
    return next(new ErrorResponse(400, `Invalid Token`));
  }
  
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({validateBeforeSave: false});
  
  sendTokenResponse(user, 200, res);
});

// @ desc   Logout User
// @ route  GET /api/v1/auth/logout
// @ access Private
export const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true  
  });

  res.status(200)
    .json({
      success: true,
      data: {}
    });
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getGeneratedToken();
  
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  
  if(process.env.NODE_ENV === 'production'){
    options.secure = true;
  }
  
  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};