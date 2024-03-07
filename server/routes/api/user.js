const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/jwt_strategy');
const UserController = require('../../controllers/UserController');
const QuizController = require('../../controllers/QuizController');

// Define routes for different CRUD operations
router.post('/register', UserController.createUser);
// router.get('/:userId', UserController.getUser);
router.post('/login', UserController.loginUser);
router.get('/check', UserController.checkUserExistence);
router.get('/profile', authenticate, UserController.profileUser);
router.get('/check-login',authenticate,UserController.checkLogin);
router.get('/quiz/results/:quizId',authenticate,QuizController.getQuizResults);
// router.post('/info', authenticate, UserController.getInfo);




module.exports = router;
