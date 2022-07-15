import express from 'express';
import { deleteUser, getUser, getUserPhoto, getUsers, saveUser, updateUser, uploadUserPhoto } from '../controllers/user.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { advancedResults } from '../middlewares/advancedResults.js';
import { upload } from '../utils/upload.js';
import User from '../models/User.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router 
  .route('/')
  .get(advancedResults(User, false), getUsers)
  .post(saveUser);

router 
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router 
  .route('/:id/photo')
  .get(getUserPhoto)
  .put(upload.single('photo'), uploadUserPhoto);

export default router;
