import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { advancedResults } from '../middlewares/advancedResults.js';
import { deleteTask, getTasks, saveTask, updateTask } from '../controllers/task.js';
import Task from '../models/Task.js';

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .get(advancedResults(Task, true, {
    path: 'user',
    select: 'name email'
  }), getTasks)
  .post(saveTask);

router
  .route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router
  .get('/all', authorize('admin'), advancedResults(Task, false, {
    path: 'user',
    select: 'name email'
  }), getTasks);

export default router;