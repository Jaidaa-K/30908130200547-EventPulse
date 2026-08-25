const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'fail',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
};


const validateRegister = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  validate
];


const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate
];


const validateCreateEvent = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('category')
    .isMongoId()
    .withMessage('Category must be a valid MongoDB ID'),

  body('date')
    .isISO8601()
    .withMessage('Date must be a valid date'),

  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive number'),

  validate
];


const validateUpdateEvent = [
  param('id')
    .isMongoId()
    .withMessage('Invalid event ID'),

  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('category')
    .optional()
    .isMongoId()
    .withMessage('Category must be a valid MongoDB ID'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date'),

  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive number'),

  validate
];


const validateRegistration = [
  body('eventId')
    .isMongoId()
    .withMessage('Event ID must be a valid MongoDB ID'),

  validate
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateCreateEvent,
  validateUpdateEvent,
  validateRegistration
};