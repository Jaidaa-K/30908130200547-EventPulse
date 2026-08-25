const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The user name is required.'],
    trim: true
  },

  email: {
    type: String,
    required: [true, 'The email is required.'],
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: [true, 'The password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.']
  },

  role: {
    type: String,
    enum: ['attendee', 'admin'],
    default: 'attendee'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;