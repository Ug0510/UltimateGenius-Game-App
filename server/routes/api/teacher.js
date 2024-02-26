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

router.post('/create-questions',authenticate,checkTeacher,QuestionController.createQuestions);
router.post('/delete-questions',authenticate,checkTeacher,QuestionController.deleteQuestions);
router.put('/:questionId',authenticate,checkTeacher,QuestionController.updateQuestion);
router.get('/get-questions',authenticate,checkTeacher,QuestionController.getAllQuestions);
router.delete('/:questionBankId',authenticate,checkTeacher,QBController.deleteQuestionBank);


router.post('/generate-quiz',authenticate,checkTeacher,QuizController.generateQuiz);
router.put('/start-quiz/:quizId', authenticate,checkTeacher, QuizController.startQuiz);
router.get('/get-students/:quizId',authenticate ,checkTeacher,QuizController.getStudents);
router.delete('/remove-student/:gameCode/:studentId',authenticate,checkTeacher, QuizController.removeStudent);

module.exports = router;