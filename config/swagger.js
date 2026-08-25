const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
    openapi: '3.0.0',

    info: {
        title: 'EventPulse API',
        version: '1.0.0',
        description: 'REST API for managing events, registrations, and announcements.'
    },

    servers: [
        {
        url: 'http://localhost:3000',
        description: 'Local development server'
        }
    ],

    tags: [
        {
        name: 'Auth',
        description: 'Authentication endpoints'
        },
        {
        name: 'Events',
        description: 'Event management endpoints'
        }
    ],

    components: {
        securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
        }
    }
    },

  apis: [
    './routes/*.js'
  ]
};

module.exports = swaggerJsdoc(options);