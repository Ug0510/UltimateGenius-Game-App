const QuizGame = require('../models/QuizGame');
const User = require('../models/User');



// Function to generate a unique 6-digit code
const generateUniqueCode = async () => {
    let code;
    let isUnique = false;

    // Loop until a unique code is generated
    while (!isUnique) {
        // Generate a random 6-digit number
        code = Math.floor(100000 + Math.random() * 900000);

        // Check if the code is already used in any QuizGame
        const existingGame = await QuizGame.findOne({ gameCode: code });

        // If no existing game found with the generated code, it's unique
        if (!existingGame) {
            isUnique = true;
        }
    }

    return code;
};

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

        // Generate a unique 6-digit code for the quiz game
        const gameCode = await generateUniqueCode();


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
            teacherId: teacherId,
            gameCode: gameCode
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
      // Extract game code from request body
      const { gameCode } = req.params;
      console.log(gameCode);
  
      // Check if the quiz exists
      const quiz = await QuizGame.findOne({ gameCode });
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      // Check if the quiz is already started
      if (quiz.isStarted) {
        return res.status(403).json({ message: 'Quiz has already started' });
      }
  
      // Check if the student is already joined
      const isJoined = quiz.studentIds.includes(req.user._id);
      if (isJoined) {
        return res.status(400).json({ message: 'You have already joined this quiz' });
      }
  
      // Add the student to the list of participants (studentIds) in the quiz
      quiz.studentIds.push(req.user._id);
      await quiz.save();
  
      res.status(200).json({ message: 'You have successfully joined the quiz',quizId:quiz._id });
    } catch (error) {
      console.error('Error joining quiz:', error);
      res.status(500).json({ message: 'Error joining quiz' });
    }
  };

//Controller to check if quiz is started 
exports.checkQuizStarted = async (req, res) => {
    try {
        const { quizId } = req.params;

        // Check if the quiz exists
        const quiz = await QuizGame.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if the quiz is started
        const isStarted = quiz.isStarted;

        res.status(200).json({ isStarted });
    } catch (error) {
        console.error('Error checking if quiz is started:', error);
        res.status(500).json({ message: 'Error checking if quiz is started' });
    }
};


// Controller to start quiz 
exports.startQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;

        // Check if the quiz exists
        const quiz = await QuizGame.findById(quizId);
        console.log(quiz);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if the teacher owns the quiz
        if (quiz.teacherId.toString() !== req.user._id.toString()) {

            return res.status(403).json({ message: 'Unauthorized to start this quiz' });
        }

        // Check if the quiz is already started
        if (quiz.isStarted) {
            return res.status(400).json({ message: 'Quiz already started' });
        }

        // Update the quiz to be started
        quiz.isStarted = true;
        await quiz.save();
        console.log()

        res.status(200).json({ message: 'Quiz started successfully' });
    } catch (error) {
        console.error('Error starting quiz:', error);
        res.status(500).json({ message: 'Error starting quiz' });
    }
};



// Controller to get students joining the quiz
exports.getStudents = async (req, res) => {
    try {
        const { quizId } = req.params;

        // Find the quiz game based on the provided quizId
        const quizGame = await QuizGame.findById(quizId);

        if (!quizGame) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Fetch student details based on studentIds
        const students = await User.find({ _id: { $in: quizGame.studentIds } }, 'gameName avatar');

        res.status(200).json({ students });
    } catch (error) {
        console.error('Error getting students:', error);
        res.status(500).json({ message: 'Error getting students' });
    }
};

// Controller function to remove a student from a quiz
exports.removeStudent = async (req, res) => {
    try {
        const { gameCode, studentId } = req.params;

        console.log(gameCode);

        // Check if the quiz exists
        const quiz = await QuizGame.findOne({ gameCode });
        console.log(quiz);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if the user is the teacher who owns the quiz
        if (quiz.teacherId.toString() !== req.user._id.toString()) {
            console.log(quiz.teacherId + ' ' + req.user._id);
            return res.status(403).json({ message: 'Unauthorized to remove student from this quiz' });
        }

        // Remove the student from the list of participants (studentIds) in the quiz
        quiz.studentIds.pull(studentId);
        await quiz.save();

        res.status(200).json({ message: 'Student removed from the quiz successfully' });
    } catch (error) {
        console.error('Error removing student:', error);
        res.status(500).json({ message: 'Error removing student' });
    }
};