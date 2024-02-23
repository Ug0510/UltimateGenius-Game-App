const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/jwt_strategy');
const UserController = require('../../controllers/UserController');
const QuizController = require('../../controllers/QuizController');

// Define routes for different CRUD operations
router.post('/', UserController.createUser);
router.get('/:userId', UserController.getUser);
router.post('/login', UserController.loginUser);
router.post('/profile', authenticate, UserController.profileUser);


router.post('/join-quiz/:quizId',authenticate, QuizController.joinQuiz);
router.get('/check-quiz-if-started/:quizId',authenticate,QuizController.checkQuizStarted);
module.exports = router;
