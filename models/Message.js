const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },

  text: {
    type: String,
    required: [true, 'The message content is required.'],
    trim: true
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;