const express = require('express');
const router = express.Router();
const authenticate = require('../../config/jwt_strategy');
const UserController = require('../../controllers/UserController');

// Define routes for different CRUD operations
router.post('/', UserController.createUser);
router.get('/:userId', UserController.getUser);
router.post('/login', UserController.loginUser);
router.post('/user-profile', authenticate, UserController.profileUser);
module.exports = router;
