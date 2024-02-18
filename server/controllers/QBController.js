const QuestionBank = require('../models/QuestionBank');
const Question = require('../models/Question');

// Create a question bank
exports.createQuestionBank = async (req, res) => {
    try {
        const { name, description, questions } = req.body;

        // Create the question bank
        const questionBank = new QuestionBank({
            name,
            description,
            questions,
            createdBy: req.user._id // Get the ID of the Teacher
        });

        // Save the question bank to the database
        const savedQuestionBank = await questionBank.save();

        return res.status(201).json(savedQuestionBank);
    } catch (error) {
        console.error('Error creating question bank:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to add questions to an existing question bank
exports.addQuestions = async (req, res) => {
    try {
        const { questionBankId } = req.params;
        const { questionIds } = req.body;
        console.log(questionBankId);
        console.log(questionIds);

        // Find the question bank by ID
        const questionBank = await QuestionBank.findById(questionBankId);
        if (!questionBank) {
            return res.status(404).json({ error: 'Question bank not found' });
        }

        // Add the question IDs to the question bank
        questionBank.questions.push(...questionIds);

        // Save the updated question bank
        const updatedQuestionBank = await questionBank.save();

        res.json(updatedQuestionBank);
    } catch (error) {
        console.error('Error adding questions to question bank:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// controller to get list of all questions in a question bank
exports.getQuestionsInQuestionBank = async (req, res) => {
    try {
        const { questionBankId } = req.params;

        // Find the question bank by ID
        const questionBank = await QuestionBank.findById(questionBankId).populate('questions');

        if (!questionBank) {
            return res.status(404).json({ error: 'Question bank not found' });
        }

        // Extract required fields from each question
        const questions = questionBank.questions.map(question => ({
          _id: question._id,
          content: question.content,
          options: question.options,
          category: question.category,
          difficultyLevel: question.difficultyLevel
        }));

        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions from question bank:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
