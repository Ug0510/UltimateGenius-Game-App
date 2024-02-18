const express = require('express');
const authenticate = require('../../middleware/jwt_strategy');
const checkTeacher = require('../../middleware/CheckTeacher');
const QBController = require('../../controllers/QBController');
const QuestionController = require('../../controllers/QuestionController');
const router = express.Router();

router.post('/create-qb',authenticate,checkTeacher,QBController.createQuestionBank);
router.post('/create-question',authenticate,checkTeacher,QuestionController.createQuestion);
router.post('/:questionBankId/add-questions',authenticate,checkTeacher,QBController.addQuestions);
router.get('/:questionBankId/questions-list',authenticate,checkTeacher,QBController.getQuestionsInQuestionBank);

module.exports = router;