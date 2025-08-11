# AI Tutor

This is a Node.js project that uses Express.js to create a server.

## Installation

To install the dependencies, run the following command:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/ai-tutor

# Session
SESSION_SECRET=your-session-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## Usage

To start the server, run the following command:

```bash
npm start
```

## Scripts

- `npm start`: Starts the server.
- `npm test`: Runs the tests.

## Environment Variables

- `PORT`: The port that the server will run on.