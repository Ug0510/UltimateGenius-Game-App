const mongoose = require('mongoose');

const questionBankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
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

// Define a virtual property for questionCount
questionBankSchema.virtual('questionCount').get(function() {
    return this.questions.length;
});

const QuestionBank = mongoose.model('QuestionBank', questionBankSchema);

module.exports = QuestionBank;
