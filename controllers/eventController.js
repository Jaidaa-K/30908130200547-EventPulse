const mongoose = require('mongoose');
const Event = require('../models/Event');
require('../models/Category');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');


// GET /api/events
// Public
exports.getAllEvents = asyncHandler(async (req, res, next) => {
  const {
    category,
    city,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = 'date',
    order = 'asc',
    search
  } = req.query;

  const filter = {};

  // Filter by category
  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return next(new AppError('Invalid category ID', 400));
    }

    filter.category = new mongoose.Types.ObjectId(category);
  }

  // Filter by city
  if (city) {
    filter.city = city;
  }

  // Filter by date range
  if (startDate || endDate) {
    filter.date = {};

    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }

    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  // Text search
  if (search) {
    const regex = new RegExp(search, 'i');

    filter.$or = [
      { title: regex },
      { description: regex }
    ];
  }

  const currentPage = Math.max(Number(page), 1);
  const itemsPerPage = Math.max(Number(limit), 1);
  const skip = (currentPage - 1) * itemsPerPage;

  const allowedSortFields = [
    'date',
    'registrations',
    'createdAt'
  ];

  const selectedSort =
    allowedSortFields.includes(sortBy)
      ? sortBy
      : 'date';

  const sortOrder = order === 'desc' ? -1 : 1;

  const total = await Event.countDocuments(filter);

  let events;

  if (selectedSort === 'registrations') {
    events = await Event.aggregate([
      { $match: filter },

      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'event',
          as: 'registrations'
        }
      },

      {
        $addFields: {
          registrationCount: {
            $size: '$registrations'
          }
        }
      },

      {
        $sort: {
          registrationCount: sortOrder
        }
      },

      { $skip: skip },
      { $limit: itemsPerPage },

      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },

      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $lookup: {
          from: 'users',
          localField: 'organizer',
          foreignField: '_id',
          as: 'organizer'
        }
      },

      {
        $unwind: {
          path: '$organizer',
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $project: {
          'organizer.password': 0,
          registrations: 0
        }
      }
    ]);
  } else {
    events = await Event.find(filter)
      .populate('category')
      .populate('organizer', '-password')
      .sort({ [selectedSort]: sortOrder })
      .skip(skip)
      .limit(itemsPerPage);
  }

  const totalPages = Math.ceil(total / itemsPerPage);

  res.status(200).json({
    status: 'success',
    total,
    page: currentPage,
    limit: itemsPerPage,
    totalPages,
    data: events
  });
});


// GET /api/events/:id
// Public
exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('category')
    .populate('organizer', '-password');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: event
  });
});

// POST /api/events
// Admin only
exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create({
    ...req.body,
    organizer: req.user.userId
  });

  const populatedEvent = await Event.findById(event._id)
    .populate('category')
    .populate('organizer', '-password');

  res.status(201).json({
    status: 'success',
    data: populatedEvent
  });
});

// PATCH /api/events/:id
// Admin only
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
    .populate('category')
    .populate('organizer', '-password');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: event
  });
});

// DELETE /api/events/:id
// Admin only
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(204).send();
});