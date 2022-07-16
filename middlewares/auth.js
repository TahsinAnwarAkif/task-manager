import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  } else if(req.cookies.token){
    token = req.cookies.token;
  }
  
  if(!token){
    return next(new ErrorResponse(401, 'Not Authorized, No Token'))
  }
  
  try{
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id)
      .populate('photo')
      .populate('tasks');
    
    next();
  }catch(error){
    console.log(error);
    next(new ErrorResponse(401, 'Not Authorized, Token Failed'));
  }
});

export const authorize = (...roles) => asyncHandler(async (req, res, next) => {
  if(roles.includes(req.user.role)){  
    next();
  }else{
    next(new ErrorResponse(403, `User role ${req.user.role} is unauthorized to access this route`));
  }
});