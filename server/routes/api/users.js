const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');

// Define routes for different CRUD operations
router.post('/', UserController.createUser);
router.get('/:userId', UserController.getUser);
router.post('/login', UserController.loginUser);
module.exports = router;
