const QuizGame = require('../models/QuizGame');


// Controller function to generate a quiz
exports.generateQuiz = async (req, res) => {
    try {
      // Extract values from request body
      const { title, category, quizBankId } = req.body;
      const description = req.body.description || '';
      const timeLimit = req.body.timeLimit || 30;
      const numberOfQuestions = req.body.numberOfQuestions || 15;
      const showCorrectAnswers = req.body.showCorrectAnswers || false;
      const passingScorePercentage = req.body.passingScorePercentage || 45;
      const sendQuizOutputToStudents = req.body.sendQuizOutputToStudents || false;
      const getQuizResultOnMail = req.body.getQuizResultOnMail || false;
      const randomizedQuestionPool = req.body.randomizedQuestionPool || false;
      const randomizedAnswerChoices = req.body.randomizedAnswerChoices || false;
      const teacherId = req.user._id;
  
      // Check if required values are missing
      if (!title || !category || !quizBankId) {
        return res.status(400).json({ message: 'Title, category, quiz bank ID, are required' });
      }
      
      
      // Create a new quiz game
      const quizGame = new QuizGame({
        title,
        category,
        description,
        timeLimit,
        quizBank: quizBankId,
        numberOfQuestions,
        showCorrectAnswers,
        passingScorePercentage,
        sendQuizOutputToStudents,
        getQuizResultOnMail,
        randomizedQuestionPool,
        randomizedAnswerChoices,
        teacherId:teacherId
      });
  
      // Save the quiz game to the database
      await quizGame.save();
  
      res.status(201).json(quizGame);
    } catch (error) {
      console.error('Error generating quiz:', error);
      res.status(500).json({ message: 'Error generating quiz' });
    }
  };
  

