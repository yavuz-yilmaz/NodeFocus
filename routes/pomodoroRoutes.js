const express = require('express');
const pomodoroController = require('../controllers/pomodoroController');

const router = express.Router();

router.get('/', pomodoroController.getAll);
router.get('/:id', pomodoroController.getPomodoroById);
router.get('/user/:id', pomodoroController.getPomodorosOfUser);
router.post('/', pomodoroController.addPomodoro);

module.exports = router;
