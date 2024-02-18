const QuestionBank = require('../models/QuestionBank');
const Question = require('../models/Question');

// Function to delete Question from database and also removes it from all questions banks it is present in
exports.deleteQuestion = async function (questionId) {
    try {
        // Find all question banks containing the question
        const questionBanks = await QuestionBank.find({ questions: questionId });

        // Remove question ID from each question bank
        const updateOperations = questionBanks.map(async (questionBank) => {
            questionBank.questions = questionBank.questions.filter(id => id.toString() !== questionId.toString());
            await questionBank.save();
        });

        // Wait for all update operations to complete
        await Promise.all(updateOperations);

        // Delete the question directly
        await Question.deleteOne({ _id: questionId });

        return { success: true, message: 'Question deleted successfully' };
    } catch (error) {
        console.error('Error deleting question and from banks:', error);
        return { success: false, error: 'Internal Server Error' };
    }
}
