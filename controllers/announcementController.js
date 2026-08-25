const Event = require('../models/Event');
const Message = require('../models/Message');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/announcements
exports.createAnnouncement = asyncHandler(async (req, res, next) => {
  const { eventId, text } = req.body;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const message = await Message.create({
    event: eventId,
    sender: req.user.userId,
    text
  });

  const io = req.app.get('io');

  io.to(eventId).emit('announcement', message);

  res.status(201).json({
    status: 'success',
    data: message
  });
});


// GET /api/announcements/:eventId
exports.getAnnouncements = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const messages = await Message.find({
    event: eventId
  })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    data: messages
  });
});