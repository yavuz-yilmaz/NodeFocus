const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getMain);
router.get('/signup', authController.isLoggedIn, viewController.getSignup);
router.get('/login', authController.isLoggedIn, viewController.getLogin);

module.exports = router;
