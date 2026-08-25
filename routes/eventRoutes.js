const express = require('express');

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const {
  validateCreateEvent,
  validateUpdateEvent
} = require('../middleware/validate');

const router = express.Router();

// Public routes

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events until this date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of events per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, registrations, createdAt]
 *           default: date
 *         description: Field used for sorting
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search title and description
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       400:
 *         description: Invalid query parameters
 */

router.get('/', getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid event ID
 */

router.get('/:id', getEventById);

// Admin-only routes

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - date
 *               - city
 *               - venue
 *               - capacity
 *             properties:
 *               title:
 *                 type: string
 *                 example: Node.js Workshop
 *               description:
 *                 type: string
 *                 example: Learn backend development with Node.js.
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-09-10
 *               city:
 *                 type: string
 *                 example: Cairo
 *               venue:
 *                 type: string
 *                 example: Cairo Technology Center
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 100
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       422:
 *         description: Validation error
 */

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  validateCreateEvent,
  createEvent
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  validateUpdateEvent,
  updateEvent
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  deleteEvent
);

module.exports = router;