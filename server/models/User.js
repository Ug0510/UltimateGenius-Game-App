const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userGender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    userType: {
        type: String,
        enum: ['teacher', 'student'], // User type can only be 'teacher' or 'student'
        required: true
    },
    email: {
        type: String,
        unique:true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gameName: {
        type: String,
        unique: true  
    },
    avatar: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
