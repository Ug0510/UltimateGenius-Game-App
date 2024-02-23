const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizGameSchema = new Schema({
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
  quizBank: {
    type: Schema.Types.ObjectId,
    ref: 'QuestionBank',
    required: true
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
    default: true
  },
  randomizedAnswerChoices: {
    type: Boolean,
    default: false
  },
  // Log of quiz games
  logs: [{
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student'
    },
    score: {
      type: Number,
      default: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

const QuizGame = mongoose.model('QuizGame', QuizGameSchema);

module.exports = QuizGame;
