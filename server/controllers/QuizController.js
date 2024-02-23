const QuizGame = require('../models/QuizGame');
const User = require('../models/User');


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

  
  

 // Controller to join Quiz
  exports.joinQuiz = async (req, res) => {
    try {
      // Extract quiz ID from URL parameter
      const { quizId } = req.params;
  
      // Check if the quiz exists
      const quiz = await QuizGame.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      // Check if quiz if started or not  
      if (quiz.isStarted)
      {
        return res.status(403).json({message: 'Quiz is already started , Wait for next Quiz'});
      }
  
      // Check if the user is a student
      const user = await User.findById(req.user._id);
      if (!user || user.userType !== 'student') {
        return res.status(403).json({ message: 'Only students are allowed to join quizzes' });
      }
  
      // Add the student to the list of participants (studentIds) in the quiz
      quiz.studentIds.push(req.user._id);
      await quiz.save();
  
      res.status(200).json({ message: 'Student joined the quiz successfully' });
    } catch (error) {
      console.error('Error joining quiz:', error);
      res.status(500).json({ message: 'Error joining quiz' });
    }
  };
  