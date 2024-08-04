const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAll = catchAsync(async (req, res, next) => {
  const tasks = await Task.find();
  res.status(200).json({
    status: 'success',
    data: { tasks },
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id });
  if (!task)
    return next(new AppError('Task with given id does not exist', 404));

  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

exports.getByUserId = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ user: req.params.id });
  res.status(200).json({
    status: 'success',
    data: { tasks },
  });
});

exports.addTask = catchAsync(async (req, res, next) => {
  const task = await Task.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { task },
  });
});

exports.deleteTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task)
    return next(new AppError('Task with given id does not exist', 404));

  res.status(200).json({
    status: 'success',
    data: { task },
  });
});
