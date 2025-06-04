# Tasks Backend API (TypeScript)

A RESTful API for managing tasks, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication (register, login, profile)
- Task management (create, read, update, delete)
- Protected routes with JWT
- Input validation
- TypeScript support
- MongoDB with Mongoose

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and copy the contents from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Set your MongoDB connection string
   - Set a secure JWT secret
   - Configure the port if needed

## Available Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the TypeScript project
- `npm start` - Start the production server
- `npm run build:watch` - Build and watch for changes

## Project Structure

```
backend/
├── dist/                  # Compiled JavaScript files
├── src/
│   ├── models/           # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── types/             # TypeScript type definitions
├── .env                   # Environment variables
├── .env.example           # Example environment variables
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Tasks

- `GET /api/tasks` - Get all tasks for the authenticated user (protected)
- `POST /api/tasks` - Create a new task (protected)
- `PUT /api/tasks/:id` - Update a task (protected)
- `DELETE /api/tasks/:id` - Delete a task (protected)

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `NODE_ENV` - Node environment (development/production)

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The server will be available at `http://localhost:5000`

## Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
