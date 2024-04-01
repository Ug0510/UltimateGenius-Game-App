const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/jwt_strategy');
const UserController = require('../../controllers/UserController');
const QuizController = require('../../controllers/QuizController');

// Define routes for different CRUD operations
router.post('/register', UserController.createUser);
// router.get('/:userId', UserController.getUser);
router.post('/login', UserController.loginUser);
router.get('/check/:gameName/:email', UserController.checkUserExistence);
router.get('/check-gname/:gameName', UserController.checkGamenameExistence);
router.get('/check-mail/:email', UserController.checkEmailExistence);
router.get('/profile', authenticate, UserController.profileUser);
router.get('/check-login',authenticate,UserController.checkLogin);
router.get('/quiz/results/:quizId',authenticate,QuizController.getQuizResults);
router.post('/send-otp', UserController.sendOtp);
router.post('/verify-otp', UserController.verifyOTP);
router.post('/check-email', UserController.checkEmail);
router.post('/reset-password', UserController.updatePassword);
router.put('/profile', authenticate, UserController.updateProfile);
// router.post('/info', authenticate, UserController.getInfo);




module.exports = router;
