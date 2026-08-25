const express = require('express');

const {
  register,
  login
} = require('../controllers/authController');

const {
  validateRegister,
  validateLogin
} = require('../middleware/validate');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *           properties:
 *             name:
 *               type: string
 *               example: User
 *             email:
 *               type: string
 *               format: email
 *               example: user@example.com
 *             password:
 *               type: string
 *               minLength: 6
 *               example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       422:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */

router.post(
  '/register',
  validateRegister,
  register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       422:
 *         description: Validation error
 */

router.post(
  '/login',
  validateLogin,
  login
);

module.exports = router;