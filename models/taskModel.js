const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide task name'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user'],
  },
  pomodoros: [],
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
