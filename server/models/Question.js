const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctAnswers: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        default: 'unclassified'
    },
    difficultyLevel: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default:'Easy'
    },
    questionBanks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionBank',
        default: []
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
