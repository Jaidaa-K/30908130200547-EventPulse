const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// MongoDB Atlas is not working in the defualt dns, so I changed it
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan  = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();
const httpServer = http.createServer(app);

app.use(morgan('dev'));

app.use(express.json());

// express-mongo-sanitize crashes Express as Express (version 5) make req.query read-only.
// This block of code creates a writable copy so express-mongo-sanitize can modify it.
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });

  next();
});

app.use(mongoSanitize());

app.get('/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');

    const dbState = mongoose.connection.readyState;

    if (dbState !== 1) {
      return res.status(503).json({
        status: 'error',
        environment: process.env.NODE_ENV || 'development',
        database: 'disconnected'
      });
    }

    res.status(200).json({
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected'
    });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);

app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

app.set('io', io);

// Socket connections
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join-event', (eventId) => {
    socket.join(eventId);

    console.log(
      `Socket ${socket.id} joined event room: ${eventId}`
    );
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found'
  });
});

app.use(errorHandler);

async function start() {
  await connectDB();

  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

if (require.main === module) {
  start();
} else {
  connectDB().catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });
}

module.exports = app;