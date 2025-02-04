const Question = require('../models/Question');
const { deleteQuestion } = require('../utils/questionUtils');
const User = require('../models/User');
const getQuestions  = require('../config/generativeAi.js');


// Create questions
exports.createQuestions = async (req, res) => {
    try {
        let questionsData = req.body;

        // If questionsData is not an array, wrap it in an array
        if (!Array.isArray(questionsData)) {
            questionsData = [questionsData];
        }

        // Get the ID of the authenticated user
        const createdBy = req.user._id;

        // Array to store saved questions
        const savedQuestions = [];

        // Iterate over each question data in the array
        for (const questionData of questionsData) {
            const { content, options, correctAnswers, category, difficultyLevel } = questionData;

            // Convert difficultyLevel to capital case (first letter capital, rest lowercase)
            const capitalizedDifficultyLevel = difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1).toLowerCase();

            // Create a new question object
            const question = new Question({
                content,
                options,
                correctAnswers,
                category,
                difficultyLevel:capitalizedDifficultyLevel,
                createdBy
            });

            // Save the question to the database
            const savedQuestion = await question.save();

            // Add saved question to the array
            savedQuestions.push(savedQuestion);

            // Add the ID of the saved question to the questions array in the user document
            await User.updateOne(
                { _id: createdBy },
                { $push: { questions: savedQuestion._id } }
            );
        }

        res.status(201).json(savedQuestions);
    } catch (error) {
        console.error('Error creating questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to delete questions
exports.deleteQuestions = async (req, res) => {
    try {
        const { questionIds } = req.body;
        // Initialize a variable to keep track of the number of deleted questions
        let deletedCount = 0;

        // Iterate through each question ID and delete them
        for (const questionId of questionIds) {
            const result = await deleteQuestion(questionId);
            if (result.success) {
                deletedCount++;
            }
        }

        // Update the user's questions array by removing the deleted question IDs
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $pull: { questions: { $in: questionIds } } });

        res.json({ message: `${deletedCount} ${deletedCount > 1 ? 'questions' : 'question'} deleted successfully` });
    } catch (error) {
        console.error('Error deleting multiple questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




// Controller to update a question or its options
exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const updateData = req.body; 

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
        const userId = req.user._id;

        // Fetch the user document
        const user = await User.findById(userId).populate('questions');

        // Check if the user is a teacher
        if (user && user.userType === 'teacher') {
            const questions = user.questions;
            return res.json(questions);
        } else {
            // If the user is not a teacher, return an error
            return res.status(403).json({ error: 'Access Forbidden' });
        }
    } catch (error) {
        console.error('Error fetching questions by teacher:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to fetch a content of specific question
exports.getQuestionById = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        res.status(200).json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.generateQuestions = async (req,res) => {
    try{
        const {numberofQuestions, course, code, specialInstructions} = req.body;



    }catch(error)
    {
        console.error('Error generating Questions: ', error);
        res.status(500).json({message: 'Service not working now, Try again later!'});
    }
};

exports.generateQuestions = async (req, res) => {
    try {
        const { numberOfQuestions, course, code, specialInstruction } = req.body;

        console.log(specialInstruction);

        // Call the getQuestions function to generate questions
        const questionsData = await getQuestions(numberOfQuestions, course, code, specialInstruction);


        // If questionsData is not an array, wrap it in an array
        if (!Array.isArray(questionsData)) {
            questionsData = [questionsData];
        }

        // Get the ID of the authenticated user
        const createdBy = req.user._id;

        // Array to store saved questions
        const savedQuestions = [];

        // Iterate over each question data in the array
        for (const questionData of questionsData) {
            const { content, options, correctAnswers, difficultyLevel } = questionData;

            // Convert difficultyLevel to capital case (first letter capital, rest lowercase)
            const capitalizedDifficultyLevel = difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1).toLowerCase();

            // Create a new question object
            const question = new Question({
                content,
                options,
                correctAnswers,
                category:course,
                difficultyLevel:capitalizedDifficultyLevel,
                createdBy
            });

            // Save the question to the database
            const savedQuestion = await question.save();

            // Add saved question to the array
            savedQuestions.push(savedQuestion);

            // Add the ID of the saved question to the questions array in the user document
            await User.updateOne(
                { _id: createdBy },
                { $push: { questions: savedQuestion._id } }
            );
        }

        res.status(201).json(savedQuestions);
    } catch (error) {
        console.error('Error creating questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};