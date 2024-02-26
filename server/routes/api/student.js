const express = require('express');
const authenticate = require('../../middleware/jwt_strategy');
const QuizController = require('../../controllers/QuizController');

const router = express.Router();

router.post('/join-quiz/:gameCode', authenticate, QuizController.joinQuiz);
router.get('/check-quiz-if-started/:quizId', authenticate, QuizController.checkQuizStarted);

module.exports = router;