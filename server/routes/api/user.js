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
router.post('/profile', authenticate, UserController.profileUser);
router.get('/check-login',authenticate,UserController.checkLogin)
// router.post('/info', authenticate, UserController.getInfo);


router.post('/join-quiz/:quizId',authenticate, QuizController.joinQuiz);
router.get('/check-quiz-if-started/:quizId',authenticate,QuizController.checkQuizStarted);
module.exports = router;
