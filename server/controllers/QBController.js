const QuestionBank = require('../models/QuestionBank');

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
