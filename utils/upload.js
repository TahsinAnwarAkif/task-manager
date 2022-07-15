import path from 'path';
import multer from 'multer';
import ErrorResponse from './ErrorResponse.js';

export const upload = multer({
  fileFilter: function(req, file, cb){
    validateFile(req, file, cb);
  }
});

function validateFile(req, file, cb){
  const supportedFileTypes = /jpg|jpeg|png/;
  const supportedFileSize = 100000;
  
  const extName = supportedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = supportedFileTypes.test(file.mimetype);
  const fileSize = parseInt(req.headers["content-length"]);
  
  if(extName && mimeType && fileSize <= supportedFileSize){
    return cb(null, true);
  }else{
    return cb(new ErrorResponse(400, 'Please add a valid image with maximum of 100 KBs'));
  }
}
