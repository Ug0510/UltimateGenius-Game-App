const mongoose = require('mongoose');

const { Schema } = mongoose;

const answerSchema = new Schema({
  questionContent: String,
  selectedOptions: [String],
  correctOptions: [String],
  score: Number,
});

const studentQuizResultLogSchema = new Schema({
  studentId: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  quiz: {
    title: {
      type: String,
      required: true,
    },
    category: String,
    teacherName: {
      type: String,
      required: true,
    },
    duration: String,
    totalQuestions: Number,
  },
  answers: [answerSchema],
  scoreObtained: {
    type: Number,
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const StudentQuizResultLog = mongoose.model('StudentQuizResultLog', studentQuizResultLogSchema);

module.exports = StudentQuizResultLog;
