const Pomodoro = require('../models/pomodoroModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAll = catchAsync(async (req, res, next) => {
  const pomodoros = await Pomodoro.find();
  res.status(200).json({
    status: 'success',
    data: { pomodoros },
  });
});

exports.getPomodoroById = catchAsync(async (req, res, next) => {
  const pomodoro = await Pomodoro.findById(req.params.id);

  if (!pomodoro)
    return next(new AppError('There is no pomodoro with given id', 404));

  res.status(200).json({
    status: 'success',
    data: { pomodoro },
  });
});

exports.getPomodorosOfUser = catchAsync(async (req, res, next) => {
  //Check is given user exists
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new AppError('User with given id does not exist', 404));
  //Get pomodoros
  const pomodoros = await Pomodoro.find({ user: user._id });
  res.status(200).json({
    status: 'success',
    data: { pomodoros },
  });
});

exports.addPomodoro = catchAsync(async (req, res, next) => {
  const pomodoro = await Pomodoro.create(req.body);

  //Check if given user exists
  const user = await User.findById(req.body.user);
  if (!user)
    return next(new AppError('User with given id does not exist', 404));

  if (req.body.task) {
    //Check if task belongs to the posted user
    const task = await Task.findById(req.body.task);
    //If task does not exist, give error
    if (!task)
      return next(new AppError('Task with given id does not exist', 404));

    if (task.user != req.body.user)
      return next(
        new AppError('Given task does not belong to posted user', 401)
      );

    task.pomodoros.push({
      user: req.body.user,
      task: req.body.task,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      duration: req.body.duration,
    });

    await task.save();
  }

  res.status(201).json({
    status: 'success',
    data: { pomodoro },
  });
});
