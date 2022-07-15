import ErrorResponse from "../utils/ErrorResponse.js";

export const notFound = (req, res, next) => {
  next(new ErrorResponse(404, `Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let error = {...err};
  error.message = err.message || 'Internal Server Error';
  error.statusCode = error.statusCode || 500;
  
  console.log(error);
  
  // Mongoose Bad ObjectId
  if(err.name === 'CastError'){
    const message = 'Resource not found';
    error = new ErrorResponse(404, message);
  }
  
  // Mongoose Duplicate Key
  if(err.code === 11000){
    const message = `${Object.keys(err['keyPattern']).join(', ')} already exists`;

    error = new ErrorResponse(400, message);
  }

  // Mongoose Validation Error
  if(err.name === 'ValidationError'){
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(400, message);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};