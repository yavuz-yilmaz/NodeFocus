const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');

exports.getMain = catchAsync(async (req, res, next) => {
  if (res.locals.user) {
    const tasks = await Task.find({ user: res.locals.user._id });
    res.status(200).render('main', {
      tasks,
    });
  } else {
    res.status(200).render('main');
  }
});

exports.getSignup = catchAsync(async (req, res, next) => {
  res.status(200).render('signup');
});

exports.getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render('login');
});
