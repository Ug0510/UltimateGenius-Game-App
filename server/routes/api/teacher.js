const express = require('express');
const authenticate = require('../../middleware/jwt_strategy');
const checkTeacher = require('../../middleware/CheckTeacher');
const QBController = require('../../controllers/QBController');
const QuestionController = require('../../controllers/QuestionController');
const QuizController = require('../../controllers/QuizController');
const router = express.Router();

router.post('/create-qb',authenticate,checkTeacher,QBController.createQuestionBank);
router.post('/:questionBankId/add-questions',authenticate,checkTeacher,QBController.addQuestionsInQuestionBank);
router.delete('/:questionBankId/remove-questions',authenticate,checkTeacher,QBController.removeQuestionsFromQuestionBank);
router.get('/:questionBankId/questions-list',authenticate,checkTeacher,QBController.getQuestionsInQuestionBank);
router.get('/get-question-bank/:questionBankId',authenticate,checkTeacher,QBController.fetchQuestionBank);

router.post('/create-questions',authenticate,checkTeacher,QuestionController.createQuestions);
router.post('/delete-questions',authenticate,checkTeacher,QuestionController.deleteQuestions);
router.put('/:questionId',authenticate,checkTeacher,QuestionController.updateQuestion);
router.get('/get-questions',authenticate,checkTeacher,QuestionController.getAllQuestions);
router.delete('/:questionBankId',authenticate,checkTeacher,QBController.deleteQuestionBank);
router.get('/questions/:questionId', authenticate, checkTeacher, QuestionController.getQuestionById);



router.post('/generate-quiz',authenticate,checkTeacher,QuizController.generateQuiz);
router.put('/start-quiz/:quizId', authenticate,checkTeacher, QuizController.startQuiz);
router.get('/get-students/:quizId',authenticate ,QuizController.getStudents);
router.delete('/remove-student/:gameCode/:studentId',authenticate,checkTeacher, QuizController.removeStudent);
router.get('/question-banks', authenticate,checkTeacher, QBController.getQuestionBanks);

router.get('/quiz/getlog/:n',authenticate, checkTeacher,QuizController.getQuizLog);

module.exports = router;