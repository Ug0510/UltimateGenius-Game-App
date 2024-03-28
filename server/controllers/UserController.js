const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail  = require('../utils/mail');
const fs = require('fs');

// Controller functions for CRUD operations
exports.createUser = async (req, res) => {
    try {
        // Check if userName only contains letters
        if (!/^[a-zA-Z\s]+$/.test(req.body.userName)) {
            return res.status(400).json({ error: 'Username should only contain letters and whitespace' });
        }
        

        // Check if required fields are missing
        const requiredFields = ['userName', 'userType','userGender', 'email', 'password'];
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

        // Encrypt password
        const saltRounds = 10;
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);

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


// exports.getUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId).select('-password');
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.json(user);
//     } catch (error) {
//         console.error('Error getting user:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// Controller for user login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user with the provided email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
        console.log(process.env.JWT_SECRET);
        // Create a copy of the user object and delete sensitive fields
        const userToSend = { ...user.toObject() }; 
        delete userToSend.password;
        delete userToSend.__v;
        delete userToSend._id;

        // Return token and user data (excluding password)
        res.json({
            token,
            user: userToSend
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// controller to get user profile data
exports.profileUser = async (req, res) => {
    try {
        // Access authenticated user from req.user
        const userId = req.user._id;

        // Check if user exists in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prepare user object to send (excluding password and __v)
        const userProfile = { ...user.toObject() };
        delete userProfile.password;
        delete userProfile.__v;

        // Return user profile
        res.json(userProfile);
    } catch (error) {
        // console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// controller to check if user is login or not
exports.checkLogin = async (req, res) => {
    try {
        // Access authenticated user from req.user
        const userId = req.user._id;

        // Check if user exists in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({isLoggedIn:true});
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Controller to check if gameName or email is already present 
exports.checkUserExistence = async (req, res) => {
    try {
        const gameName = req.params.gameName;
        const email = req.params.email;

      // Check if gameName or email already exists in the database
      const existingUser = await User.findOne({ $or: [{ gameName }, { email }] });
  
      if (existingUser) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Function to generate a random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}


// Controller to generate and send Otp to user for verification service
exports.sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        // Ensure email is provided
        if (!email) {
            return res.status(400).json({ message: 'Email address is required' });
        }

        // Generate a random OTP
        const otp = generateOTP();

        // Read HTML template file
        const htmlTemplate = fs.readFileSync('./templates/email-verify.html', 'utf8');

        // Replace placeholders in the HTML template with actual values
        const formattedHtml = htmlTemplate.replace('<!--OTP_PLACEHOLDER-->', otp);

        const emailOptions = {
            to: email,
            subject: 'Email Verification',
            html: formattedHtml
        };

        // Send email
        await sendEmail(emailOptions);

        return res.json({ message: 'Email Sent Successfully' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        return res.status(500).json({ message: 'Unable to send verification email, please try again later' });
    }
};

