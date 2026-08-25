const express = require('express');

const {
  createAnnouncement,
  getAnnouncements
} = require('../controllers/announcementController');

const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// Admin-only announcement creation
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  createAnnouncement
);

// Public announcement history
router.get(
  '/:eventId',
  getAnnouncements
);

module.exports = router;