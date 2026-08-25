# EventPulse API

A RESTful backend API for managing events, users, registrations, and real-time event announcements.

EventPulse was built with Node.js, Express, MongoDB, Mongoose, JWT authentication, Socket.io, Swagger, Jest, and Supertest.

## Features

-   User registration and login
-   JWT-based authentication
-   Role-based authorization for administrators
-   Event creation, updating, deletion, filtering, searching, sorting, and pagination
-   Event categories
-   Event registration and cancellation
-   Event capacity enforcement
-   Double-registration prevention
-   Real-time event announcements with Socket.io
-   Announcement history stored in MongoDB
-   Request validation with `express-validator`
-   Centralized error handling
-   Automated unit and integration tests
-   Interactive Swagger API documentation
-   MongoDB Atlas database integration

## Tech Stack

-   **Node.js**
-   **Express.js**
-   **MongoDB Atlas**
-   **Mongoose**
-   **JWT**
-   **bcrypt**
-   **Socket.io**
-   **express-validator**
-   **Swagger / OpenAPI**
-   **Jest**
-   **Supertest**
-   **dotenv**
-   **Morgan**

## Project Structure

``` text
EventPulse/
  - config/
    - db.js
    - swagger.js
  - controllers/
    - announcementController.js
    - authController.js
    - eventController.js
    - registrationController.js
  - middleware/
    - errorHandler.js
    - requireAuth.js
    - requireRole.js
    - validate.js
  - models/
    - Category.js
    - Event.js
    - Message.js
    - Registration.js
    - User.js
  - postman/
    -EventPulse API.postman_collection.json
  - routes/
    - announcementRoutes.js
    - authRoutes.js
    - eventRoutes.js
    - registrationRoutes.js
  - tests/
    - unit/
      - AppError.test.js
      - asyncHandler.test.js
    - integration/
      - events.test.js
  - utils/
    - appError.js
    - asyncHandler.js
  - seed.js
  - app.js
  - package.json
  - jest.config.js
  - .env
  - .env.example
```

## Installation

### 1. Clone the project

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd EventPulse
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

``` env
PORT=3000
MONGO_URI=mongodb_atlas_connection_string
JWT_SECRET=jwt_secret
NODE_ENV=development

SEED_ADMIN_NAME=Admin
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=123@abc
```

## Running the Server

### Development

``` bash
npm run dev
```

### Production

``` bash
npm start
```

The API will normally be available at:

```
http://localhost:3000
```

## Database Seeding

The project includes a seed script for creating sample categories, an
administrator, and sample events.

Run:

``` bash
node seed.js
```

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api-docs
```

Swagger provides interactive documentation for the API, including
request parameters, request bodies, authentication, and responses.

## Main API Endpoints

### Authentication

  Method   Endpoint               Description
  -------- ---------------------- -------------------------
  POST     `/api/auth/register`   Register a new user
  POST     `/api/auth/login`      Login and receive a JWT

### Events

  Method   Endpoint            Description
  -------- ------------------- --------------------
  GET      `/api/events`       Get all events
  GET      `/api/events/:id`   Get an event by ID
  POST     `/api/events`       Create an event
  PATCH    `/api/events/:id`   Update an event
  DELETE   `/api/events/:id`   Delete an event

Event listing supports filtering, searching, sorting, pagination, city
filtering, category filtering, and date ranges.

### Registrations

  --------------------------------------------------------------------------
  Method                  Endpoint                   Description
  ----------------------- -------------------------- -----------------------
  POST                    `/api/registrations`       Register the
                                                     authenticated attendee
                                                     for an event

  GET                     `/api/registrations/my`    Get the authenticated
                                                     user's registrations

  DELETE                  `/api/registrations/:id`   Cancel a registration
  --------------------------------------------------------------------------

Registration validation rules:

-   The event must exist.
-   A user cannot register for the same event twice.
-   Registration is rejected when the event reaches capacity.
-   Registration records use a unique event/attendee combination.
-   Registration routes require authentication.

### Announcements

  -------------------------------------------------------------------------------
  Method                  Endpoint                        Description
  ----------------------- ------------------------------- -----------------------
  POST                    `/api/announcements`            Create and broadcast an
                                                          announcement

  GET                     `/api/announcements/:eventId`   Get announcement
                                                          history for an event
  -------------------------------------------------------------------------------

Creating announcements is restricted to authenticated administrators.

Announcements are persisted in MongoDB and broadcast to the
corresponding Socket.io event room.

## Authentication

Protected endpoints use JWT authentication.

Include the token:

``` http
Authorization: Bearer YOUR_JWT_TOKEN
```

Swagger UI can also be used to authorize requests through its
**Authorize** button.

## Real-Time Announcements

Socket.io is used for real-time announcements.

Each event has its own Socket.io room. Clients can join an event room
using:

``` js
socket.emit('join-event', eventId);
```

When an administrator creates an announcement, the server broadcasts it
to that event's room:

``` js
io.to(eventId).emit('announcement', message);
```

This prevents announcements for one event from being broadcast to
attendees of unrelated events.

## Validation

Incoming requests are validated using `express-validator`.

For example, validation failures return:

``` json
{
  "status": "fail",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ]
}
```

Validation failures use HTTP status:

``` text
422 Unprocessable Entity
```

## Error Handling

The API uses centralized error handling.

Common error types include:

  Error                                  Status
  -------------------------- ------------------
  Validation Error                          400
  Invalid MongoDB ObjectId                  400
  Duplicate Key                             409
  AppError                     Defined by error
  Unhandled Error                           500

Errors are handled by the centralized error-handling middleware.

## Testing

The project uses Jest for unit tests and Supertest for integration
tests.

Run the complete test suite with:

``` bash
npm test
```

### Unit Tests

Unit tests cover:

-   `AppError`
-   `asyncHandler`

### Integration Tests

Integration tests cover API request/response behavior, including:

-   Getting events
-   Authentication requirements
-   Validation failures


## Health Check

The API includes a health endpoint:

``` http
GET /health
```


## Postman

A Postman collection can be used to test the API manually.

The collection include folders for:

-   Auth
-   Events
-   Registrations
-   Announcements

For authenticated requests, store the JWT token in a Postman
environment and reuse it in protected endpoints.

## Environment Variables


  Variable                Purpose
  ----------------------- ---------------------------------
  `PORT`                  Server port
  `MONGO_URI`             MongoDB Atlas connection string
  `JWT_SECRET`            Secret used to sign JWT tokens
  `NODE_ENV`              Application environment
  `SEED_ADMIN_NAME`       Seed administrator name
  `SEED_ADMIN_EMAIL`      Seed administrator email
  `SEED_ADMIN_PASSWORD`   Seed administrator password


## Deployment

The API is designed to be deployed to a cloud platform such as Vercel.

Vercel link:

```
https://30908130200547-event-pulse.vercel.app
```

**EventPulse API**

Built as a backend development project demonstrating REST API design,
database integration, authentication, validation, testing, real-time
communication, and API documentation.
