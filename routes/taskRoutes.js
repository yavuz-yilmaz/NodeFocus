const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.delete('/:id', taskController.deleteTaskById);
router.get('/user/:id', taskController.getByUserId);

router.post('/', taskController.addTask);
module.exports = router;
