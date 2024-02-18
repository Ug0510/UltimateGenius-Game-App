const Question = require('../models/Question');

// Create a question
exports.createQuestion = async (req, res) => {
    try {
        const { content, options, correctAnswers, category, difficultyLevel } = req.body;

        // Get the ID of the authenticated user
        const createdBy = req.user._id;

        // Create the question
        const question = new Question({
            content,
            options,
            correctAnswers,
            category,
            difficultyLevel,
            createdBy
        });
9
        // Save the question to the database
        const savedQuestion = await question.save();

        res.status(201).json(savedQuestion);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
