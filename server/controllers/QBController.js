const QuestionBank = require('../models/QuestionBank');
const Question = require('../models/Question');
const User = require('../models/User');

// Create a question bank
exports.createQuestionBank = async (req, res) => {
    try {
        const { name, description, questions } = req.body;
        const userId = req.user._id;

        // Create the question bank
        const questionBank = new QuestionBank({
            name,
            description,
            questions,
            createdBy: userId 
        });

        // Save the question bank to the database
        const savedQuestionBank = await questionBank.save();

        // Find the user by ID and update the question banks array
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.questionBanks.push(savedQuestionBank._id);
        await user.save();

        return res.status(201).json(savedQuestionBank);
    } catch (error) {
        console.error('Error creating question bank:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Controller to add questions to an existing question bank
exports.addQuestionsInQuestionBank = async (req, res) => {
    try {
        const { questionBankId } = req.params;
        const { questionIds } = req.body;

        // Find the question bank by ID
        const questionBank = await QuestionBank.findById(questionBankId);
        if (!questionBank) {
            return res.status(404).json({ error: 'Question bank not found' });
        }

        // Add the question IDs to the question bank
        questionBank.questions.push(...questionIds);

        // Update the questionBanks property of each question
        for (const questionId of questionIds) {
            const question = await Question.findById(questionId);
            if (question) {
                question.questionBanks.push(questionBankId);
                await question.save();
            }
        }

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


// controller to remove questions from a question bank
exports.removeQuestionsFromQuestionBank = async (req, res) => {
    try {
        let { questionBankId } = req.params;
        const { questionIds } = req.body;

        // Trim leading and trailing spaces from the question bank ID
        questionBankId = questionBankId.trim();

        // Find the question bank by ID
        const questionBank = await QuestionBank.findById(questionBankId);
        if (!questionBank) {
            return res.status(404).json({ error: 'Question bank not found' });
        }

        // Remove the question IDs from the question bank
        questionBank.questions = questionBank.questions.filter(questionId => !questionIds.includes(questionId.toString()));


        // Update the questionBanks property of each question being removed
        for (const questionId of questionIds) {
            const question = await Question.findById(questionId);
            if (question) {
                question.questionBanks = question.questionBanks.filter(id => id.toString() !== questionBankId.toString());
                await question.save();
            }
        }

        // Save the updated question bank
        const updatedQuestionBank = await questionBank.save();

        res.json(updatedQuestionBank);
    } catch (error) {
        console.error('Error removing questions from question bank:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to delete the QuestionBank
exports.deleteQuestionBank = async (req, res) => {
    try {
        const { questionBankId } = req.params;
        const userId = req.user._id;

        // Find the user document and update the questionBanks array
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { questionBanks: questionBankId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the question bank by ID and delete it
        const deletedQuestionBank = await QuestionBank.findByIdAndDelete(questionBankId);

        if (!deletedQuestionBank) {
            return res.status(404).json({ error: 'Question bank not found' });
        }

        res.json({ message: 'Question bank deleted successfully' });
    } catch (error) {
        console.error('Error deleting question bank:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// Controller to get list of all question-banks created by current teacher
exports.getQuestionBanks = async (req, res) => {
    try {
        const userId = req.user._id;

        // Retrieve the user document
        const user = await User.findById(userId).populate('questionBank');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is a teacher
        if (user.userType !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can access question banks' });
        }

        // Get the question banks from the user's document
        const questionBanks = user.questionBanks;

        res.status(200).json({ questionBanks });
    } catch (error) {
        console.error('Error fetching question banks:', error);
        res.status(500).json({ message: 'Error fetching question banks' });
    }
};
