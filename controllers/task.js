import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Task from '../models/Task.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @ desc   Get All Tasks
// @ route  GET /api/v1/tasks/all
// @ access Private
export const getAllTasks = asyncHandler(async (req, res, next) => {    
  res.status(200).json(res.advancedResults);
});

// @ desc   Get Logged In User's Tasks
// @ route  GET /api/v1/tasks
// @ access Private
export const getTasks = asyncHandler(async (req, res, next) => {    
  res.status(200).json(res.advancedResults);
});

// @ desc   Save a Task
// @ route  POST /api/v1/tasks
// @ access Private
export const saveTask = asyncHandler(async (req, res, next) => {    
  const {
    description,
    completed = false,
  } = req.body;
  let user = req.user._id;
  
  if(req.user.role === 'admin' && req.body.user){
    if(await User.findOne({_id: req.body.user})){
      user = req.body.user;
    }else{
      return next(new ErrorResponse(400, `User not found with id: ${req.body.user}`));
    }
  }
  
  const task = new Task({description, completed, user});
  await task.save();
  
  res.status(200).json({
    success: true,
    data: task
  });
});

// @ desc   Update a Task
// @ route  PUT /api/v1/tasks/:id
// @ access Private
export const updateTask = asyncHandler(async (req, res, next) => {    
  let query = {_id: req.params.id};

  if(req.user.role !== 'admin'){
    query.user = req.user._id;
  }

  let task = await Task.findOne(query);

  if(!task){
    return next(new ErrorResponse(400, `Task not found with id: ${req.params.id}`));  
  }

  const {description,completed} = req.body;
  
  task.description = description || task.description;
  task.completed = completed || task.completed;

  task = await task.save();
  
  res.status(200).json({
    success: true,
    data: task
  });
});

// @ desc   Delete a Task
// @ route  DELETE /api/v1/tasks/:id
// @ access Private
export const deleteTask = asyncHandler(async (req, res, next) => {    
  let query = {_id: req.params.id};

  if(req.user.role !== 'admin'){
    query.user = req.user._id;
  }

  let task = await Task.findOne(query);

  if(!task){
    return next(new ErrorResponse(400, `Task not found with id: ${req.params.id}`));  
  }

  await task.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});