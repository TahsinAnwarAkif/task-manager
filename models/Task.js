import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please add a user'],
    ref: 'User'
  },

}, {
  timestamps: true
});

const task = mongoose.model('Task', taskSchema);

export default task;