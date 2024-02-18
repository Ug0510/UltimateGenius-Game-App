const Question = require('../models/Question');

// Create questions
exports.createQuestions = async (req, res) => {
    try {
        // Extract questions array from request body
        const questionsData = req.body;

        // Get the ID of the authenticated user
        const createdBy = req.user._id;

        // Array to store saved questions
        const savedQuestions = [];

        // Iterate over each question data in the array
        for (const questionData of questionsData) {
            const { content, options, correctAnswers, category, difficultyLevel } = questionData;

            // Create a new question object
            const question = new Question({
                content,
                options,
                correctAnswers,
                category,
                difficultyLevel,
                createdBy
            });

            // Save the question to the database
            const savedQuestion = await question.save();

            // Add saved question to the array
            savedQuestions.push(savedQuestion);
        }

        res.status(201).json(savedQuestions);
    } catch (error) {
        console.error('Error creating questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


