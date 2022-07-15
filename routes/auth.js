import express from 'express';
import { 
  forgotPassword, 
  getMe, 
  getMyPhoto, 
  loginUser, 
  logoutUser, 
  registerUser, 
  resetPassword, 
  updateMyDetails, 
  updateMyPassword, 
  uploadMyPhoto
} from '../controllers/auth.js';
import {upload} from '../utils/upload.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router 
  .route('/me')
  .get(authenticate, getMe);

router
  .route('/me/details')
  .put(authenticate, updateMyDetails);

router
  .route('/me/photo')
  .get(authenticate, getMyPhoto)
  .put(authenticate, upload.single('photo'), uploadMyPhoto);

router
  .route('/me/password')
  .put(authenticate, updateMyPassword);

router
  .route('/login')
  .post(loginUser);

router
  .route('/register')
  .post(registerUser);

router
  .route('/forgotPassword')
  .post(forgotPassword);

router
  .route('/resetPassword/:resetToken')
  .put(resetPassword);

router
  .route('/logout')
  .get(authenticate, logoutUser);

export default router;
