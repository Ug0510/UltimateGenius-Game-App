const Question = require('../models/Question');
const { deleteQuestion } = require('../utils/questionUtils');

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


// Controller to delete Questions 
exports.deleteQuestions = async (req, res) => {
    try {
        const { questionIds } = req.body;

        // Initialize a variable to keep track of the number of deleted questions
        let deletedCount = 0;

        // Iterate through each question ID and delete them
        const deleteOperations = questionIds.map(async (questionId) => {
            const result = await deleteQuestion(questionId);
            if (result.success) {
                deletedCount++;
            }
            return result;
        });

        // Wait for all delete operations to complete
        const results = await Promise.all(deleteOperations);

        // Check if any deletion operation failed
        const failedDeletions = results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
            return res.status(500).json({ error: 'Some questions could not be deleted', failedDeletions });
        }

        res.json({ message: `${deletedCount} ${deletedCount > 1?'questions':'question'} deleted successfully` });
    } catch (error) {
        console.error('Error deleting multiple questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//Controller to update Question or it's options
exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const updateData = req.body; // Data to update the question

        // Find the question by ID and update it
        const updatedQuestion = await Question.findByIdAndUpdate(questionId, updateData, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json(updatedQuestion);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to get all questions
exports.getAllQuestions = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user ID is available in the request object

        // Fetch all questions created by the user from the database
        const questions = await Question.find({ createdBy: userId });

        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions by user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
