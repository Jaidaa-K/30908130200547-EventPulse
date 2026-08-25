const express = require('express');

const {
  createRegistration,
  getMyRegistrations,
  deleteRegistration
} = require('../controllers/registrationController');

const requireAuth = require('../middleware/requireAuth');
const {
  validateRegistration
} = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  requireAuth,
  validateRegistration,
  createRegistration
);

router.get(
  '/my',
  requireAuth,
  getMyRegistrations
);

router.delete(
  '/:id', 
  requireAuth, 
  deleteRegistration
);

module.exports = router;