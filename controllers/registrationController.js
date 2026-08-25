const Event = require('../models/Event');
const Registration = require('../models/Registration');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/registrations
exports.createRegistration = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;
  const userId = req.user.userId;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const existingRegistration = await Registration.findOne({
    event: eventId,
    attendee: userId
  });

  if (existingRegistration) {
    return next(
      new AppError('You are already registered for this event', 400)
    );
  }

  const registrationCount = await Registration.countDocuments({
    event: eventId
  });

  if (registrationCount >= event.capacity) {
    return next(new AppError('This event is full', 400));
  }

  const registration = await Registration.create({
    event: eventId,
    attendee: userId
  });

  res.status(201).json({
    status: 'success',
    data: registration
  });
});


// GET /api/registrations/my
exports.getMyRegistrations = asyncHandler(async (req, res, next) => {
  const registrations = await Registration.find({
    attendee: req.user.userId
  }).populate('event');

  res.status(200).json({
    status: 'success',
    data: registrations
  });
});


// DELETE /api/registrations/:id
exports.deleteRegistration = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    return next(new AppError('Registration not found', 404));
  }

  if (registration.attendee.toString() !== req.user.userId) {
    return next(
      new AppError('You do not have permission to delete this registration', 403)
    );
  }

  await Registration.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null
  });
});