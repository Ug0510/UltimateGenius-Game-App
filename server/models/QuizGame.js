const mongoose = require('mongoose');

const QuizGameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  timeLimit: {
    type: Number,
    default: 30
  },
  questionBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionBank',
    required: true
  },
  numberOfQuestions: {
    type: Number,
    default: 15
  },
  showCorrectAnswers: {
    type: Boolean,
    default: false
  },
  passingScorePercentage: {
    type: Number,
    default: 45
  },
  sendQuizOutputToStudents: {
    type: Boolean,
    default: false
  },
  getQuizResultOnMail: {
    type: Boolean,
    default: false
  },
  randomizedQuestionPool: {
    type: Boolean,
    default: false
  },
  randomizedAnswerChoices: {
    type: Boolean,
    default: false
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  studentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }], 
  isStarted: {
    type: Boolean,
    default: false
  },
  gameCode: {
    type: Number,
    required: true,
    unique: true 
  },
  resultLog: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentQuizResultLog'
  }]
});

const QuizGame = mongoose.model('QuizGame', QuizGameSchema);

module.exports = QuizGame;