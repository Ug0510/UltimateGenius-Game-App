const QuizGame = require('../models/QuizGame');
const User = require('../models/User');
const Question = require('../models/Question');
const StudentQuizResultLog = require('../models/StudentQuizResultLog');

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
            questionBank: quizBankId,
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

        // Add the generated quiz ID to the user's gameLog
        const user = await User.findById(teacherId);
        user.gameLog.push(quizGame);
        await user.save();


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

        // Automatically set isStarted to false after quiz.timeLimit minutes
        setTimeout(async () => {
            quiz.isStarted = false;
            await quiz.save();
            console.log(`Quiz ${quizId} automatically ended`);
        }, quiz.timeLimit * 60 * 1000); // Convert minutes to milliseconds

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
        console.log(quiz.studentIds +"8");

        res.status(200).json({ message: 'Student removed from the quiz successfully' });
    } catch (error) {
        console.error('Error removing student:', error);
        res.status(500).json({ message: 'Error removing student' });
    }
};

// Controller function to fetch quiz details and questions
exports.getQuizDetails = async (req, res) => {
    try {
        const { quizId } = req.params;

        // Find the quiz game based on the provided game code
        const quizGame = await QuizGame.findOne({ '_id':quizId }).populate('questionBank');

        if (!quizGame) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Fetch quiz details
        const { title, category, description, timeLimit, numberOfQuestions, questionBank } = quizGame;

        // Fetch questions for the quiz from the associated question bank
        const questions = await Question.find({ _id: { $in: questionBank.questions } }).limit(numberOfQuestions);

        // Prepare the quiz details response
        const quizDetails = {
            title,
            category,
            description,
            timeLimit,
            numberOfQuestions,
            questions
        };

        res.status(200).json(quizDetails);
    } catch (error) {
        console.error('Error fetching quiz details:', error);
        res.status(500).json({ message: 'Error fetching quiz details' });
    }
};


// Controller function to save quiz result
exports.saveQuizResult = async (req, res) => {
  try {
    const { quizId, answers, scoreObtained, totalScore } = req.body;

    const quiz = await QuizGame.findById(quizId).populate('teacherId');

    // Check if the quiz result already exists for the same student and quiz
    const existingResult = await StudentQuizResultLog.findOne({ studentId: req.user._id, 'quiz.quizId': quiz._id });
    if (existingResult) {
      return res.status(400).json({ message: 'Quiz result already submitted for this student and quiz' });
    }   

   const student = await User.findById(req.user._id);


    // Construct the quiz object
    const quizObj = {
      title: quiz.title,
      quizId: quiz._id,
      category: quiz.category,
      teacherName: quiz.teacherId.userName,
      duration: quiz.timeLimit,
      totalQuestions: quiz.numberOfQuestions
    };

    // Construct the studentQuizResultLog object
    const studentQuizResultLog = new StudentQuizResultLog({
      studentId: student._id, 
      studentName: student.userName, 
      quiz:quizObj,
      answers,
      scoreObtained,
      totalScore,
      submittedAt: new Date()
    });

    quiz.resultLog.push(studentQuizResultLog);

    // To save updated quiz in database
    await quiz.save();

    // Save the quiz result log to the database
    await studentQuizResultLog.save();
    res.status(201).json({ message: 'Quiz result saved successfully' });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller function to fetch quiz results
exports.getQuizResults = async (req, res) => {
    try {
      // Fetch quiz results from the database
      const {quizId} = req.params;
      let quiz = await QuizGame.findById(quizId).populate({
        path: 'resultLog',
        populate: {
          path: 'studentId',
          model: 'User'
        }
      });

      // Adding teacher name too
      const teacher = await User.findById(quiz.teacherId);
      
      const quizModified = {...quiz._doc, teacherName:teacher.userName};
    
      // Return quiz results as JSON response
      res.status(200).json(quizModified);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Controller function to fetch the last N result logs
exports.getLastNResultLogs = async (req, res) => {
  try {
      let { n } = req.params;
      
      // Convert n to integer
      n = parseInt(n); 
      
      // Check if n is less than 0
      if (n < 0) {
          return res.status(400).json({ message: 'Please enter a valid number of records' });
      }

      let lastNResultLogs;

      console.log('user ', req.user._id, "-> ", n);

      const all = await StudentQuizResultLog.find();

    

      // If n is 0, fetch all records
      if (n === 0) {
          lastNResultLogs = await StudentQuizResultLog.find({ studentId: req.user._id }).sort({ submittedAt: -1 });
      } else {
          // Fetch the last N records
          lastNResultLogs = await StudentQuizResultLog.find({ studentId: req.user._id })
              .sort({ submittedAt: -1 }) 
              .limit(n); 
      }
      console.log(lastNResultLogs);
      res.status(200).json(lastNResultLogs);
  } catch (error) {
      console.error('Error fetching last N result logs:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get the last n quiz logs created by the teacher
exports.getQuizLog = async (req, res) => {
    try {
        // Extract the value of n from request parameters
        const { n } = req.params;

        // Ensure n is a valid number
        if (isNaN(n) || n <= 0) {
            return res.status(400).json({ message: 'Invalid value for n' });
        }
        console.log('here', req.user._id);
        const teacher = await User.findById(req.user._id);
        console.log(teacher);

        let gameLogs;

        // If n is 0, retrieve all game logs
        if (n == 0) {
            gameLogs = teacher.gameLog;
        } else {
            // Extract the latest n game log IDs
            const latestGameLogs = teacher.gameLog.slice(-n);

            // Populate the latest game logs
            gameLogs = await QuizGame.find({ _id: { $in: latestGameLogs } }).populate('resultLog');
        }

        // Reverse the order of the gameLogs array
        gameLogs.reverse();

        // Return the latest n quiz logs or all if n is 0
        res.status(200).json(gameLogs);
        
    } catch (error) {
        console.error('Error fetching quiz logs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
