import mongoose from "mongoose";
import colors from 'colors';
import {connectDB} from './config/db.js';
import User from './models/User.js';
import {users} from './data/users.js';
import {tasks} from './data/tasks.js';
import Task from "./models/Task.js";

connectDB();

const importData = async() => {
  try{
    await Task.deleteMany();
    await User.deleteMany();

    await User.create(users);
    const admin = await User.findOne({email: 'admin@gmail.com'});
    const user = await User.findOne({email: 'user@gmail.com'});
    
    for(let i = 0; i < tasks.length - 1; i++){
      tasks[i].user = admin._id;
      await Task.create(tasks[i]);
    }

    tasks[tasks.length - 1].user = user._id;
    await Task.create(tasks[tasks.length - 1]);
    
    console.log('Data Imported!'.green.inverse);
  }catch(error){
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
}

const destroyData = async() => {
  try{
    await User.deleteMany();
    await Task.deleteMany();
    
    console.log('Data Destroyed!'.green.inverse);
  }catch(error){
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
}

if(process.argv[2] == '-d'){
  destroyData();
}else{
  importData();
}