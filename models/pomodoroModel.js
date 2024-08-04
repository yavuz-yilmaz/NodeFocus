const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user'],
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
  start_time: { type: Date, required: [true, 'Please provide a start time'] },
  end_time: { type: Date, required: [true, 'Please provide a end time'] },
  duration: { type: Number, required: [true, 'Please provide a duration'] },
});

const Pomodoro = mongoose.model('Pomodoro', pomodoroSchema);

module.exports = Pomodoro;
