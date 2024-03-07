const express = require('express');
const authenticate = require('../../middleware/jwt_strategy');
const QuizController = require('../../controllers/QuizController');

const router = express.Router();

router.post('/join-quiz/:gameCode', authenticate, QuizController.joinQuiz);
router.get('/check-quiz-if-started/:quizId', authenticate, QuizController.checkQuizStarted);
router.get('/quiz/play/:quizId',authenticate,QuizController.getQuizDetails);
router.post('/quiz/submit',authenticate,QuizController.saveQuizResult);



module.exports = router;