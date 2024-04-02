const mongoose = require('mongoose');

const { Schema } = mongoose;

const userEmailVerificationSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,  
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // Configure TTL index
  ttl: 120, // Expires in 2 minutes (120 seconds)
});

module.exports = mongoose.model('UserEmailVerification', userEmailVerificationSchema);
