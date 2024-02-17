//UserController.js

const User = require('../models/User');

// Controller functions for CRUD operations
exports.createUser = async (req, res) => {
    try {
        // Check if userName only contains letters
        if (!/^[a-zA-Z\s]+$/.test(req.body.userName)) {
            return res.status(400).json({ error: 'Username should only contain letters and whitespace' });
        }
        

        // Check if required fields are missing
        const requiredFields = ['userName', 'userType', 'email', 'password'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Check if phone number is valid (optional)
        const phoneNumberRegex = /^\d{10}$/; // Assuming a valid phone number is 10 digits
        if (req.body.phoneNumber && !phoneNumberRegex.test(req.body.phoneNumber)) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        // Check if password is alphanumeric
        if (!/^[a-zA-Z0-9]+$/.test(req.body.password)) {
            return res.status(400).json({ error: 'Password should be alphanumeric' });
        }

        // Check if avatar field is blank then set base avatar
        if (!req.body.avatar) {
            req.body.avatar = 'base.png';
        }

        // Check if gameName already exists
        const existingUser = await User.findOne({ gameName: req.body.gameName });
        const existingUserEmail = await User.findOne({ email: req.body.email});
        console.log(existingUserEmail? existingUserEmail:existingUser);
        if (existingUser || existingUserEmail) {
            return res.status(400).json({ error: 'User already exists' });
        }


        // Create a new user
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

