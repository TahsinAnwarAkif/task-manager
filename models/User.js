import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { generateHash } from '../utils/generateHash.js';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email address'
    ],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    select: false
  },
  photo: {
    type: Buffer,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
  timestamps: true
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

userSchema.methods.getGeneratedToken = function() {
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
};

userSchema.methods.prepareResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = generateHash(resetToken);
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next();
  }
  
  this.password = await bcrypt.hashSync(this.password, 10);
});

userSchema.pre('remove', async function(next){
  await this.model('Task').deleteMany({
    user: this._id
  });
  
  next();
});

const user = mongoose.model('User', userSchema);

export default user;