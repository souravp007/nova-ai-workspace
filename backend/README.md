# Nova AI Workspace Backend

Express.js API for Nova AI Workspace. It handles authentication, conversation history, message storage, image uploads, and Gemini-powered AI responses.

## Tech Stack

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- HTTP-only refresh token cookie
- Zod validation
- Multer file uploads
- Cloudinary image storage
- Google Gemini API

## Folder Structure

```text
backend/
  src/
    config/          External service and database config
    constants/       Cookie and AI constants
    controllers/     HTTP request handlers
    middlewares/     Auth, validation, upload, and error middleware
    models/          Mongoose models
    routes/          API route definitions
    services/        Business logic and integrations
    utils/           API helpers and async wrappers
    app.js           Express app setup
    server.js        Server bootstrap
  package.json
```

## Getting Started

Install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=
CLIENT_URL=

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

Run the development server:

```bash
npm run dev
```

Run in production mode:

```bash
npm start
```

Default API base URL:

```text
http://localhost:8000/api/v1
```

## Scripts

```bash
npm run dev     # Start with nodemon
npm start       # Start with node
npm test        # Placeholder test script
```

## API Overview

All routes are mounted under:

```text
/api/v1
```

### Health

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| GET    | `/health` | Check server health |

### Auth

| Method | Endpoint              | Auth   | Description                    |
| ------ | --------------------- | ------ | ------------------------------ |
| POST   | `/auth/register`      | No     | Create a new user              |
| POST   | `/auth/login`         | No     | Login and receive access token |
| POST   | `/auth/refresh-token` | Cookie | Refresh access token           |
| GET    | `/auth/me`            | Yes    | Get current user               |
| POST   | `/auth/logout`        | Yes    | Logout current user            |

Register body:

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "Strong@123"
}
```

Login body:

```json
{
  "email": "user@example.com",
  "password": "Strong@123"
}
```

### Conversations

| Method | Endpoint                                | Auth | Description               |
| ------ | --------------------------------------- | ---- | ------------------------- |
| GET    | `/conversation?page=1&limit=20&search=` | Yes  | List conversations        |
| GET    | `/conversation/:id`                     | Yes  | Get one conversation      |
| DELETE | `/conversation/:id`                     | Yes  | Delete conversation       |
| PATCH  | `/conversation/:id/pin`                 | Yes  | Pin or unpin conversation |

Current implementation note: rename is currently wired as `DELETE /conversation/:id` with a title body in the route file, which conflicts with delete. A cleaner backend route would be `PATCH /conversation/:id` for rename.

Rename body used by the current service:

```json
{
  "title": "New title"
}
```

### Messages

| Method | Endpoint            | Auth | Description                     |
| ------ | ------------------- | ---- | ------------------------------- |
| GET    | `/message/:id/chat` | Yes  | Get messages for a conversation |

### AI

| Method | Endpoint          | Auth | Description                          |
| ------ | ----------------- | ---- | ------------------------------------ |
| POST   | `/ai/chat`        | Yes  | Send a message and get full response |
| POST   | `/ai/chat/stream` | Yes  | Send a message and stream response   |

`/ai/chat` uses `multipart/form-data`.

Fields:

```text
conversationId  optional existing conversation id
message         optional text message
files           optional image files, maximum 5
```

Example response:

```json
{
  "success": true,
  "message": "Response generated successfully",
  "data": {
    "conversationId": "conversation_id",
    "response": "AI response text",
    "tokensUsed": 123
  }
}
```

## Auth Flow

1. User logs in or registers.
2. Backend returns an access token in JSON.
3. Backend stores refresh token in an HTTP-only cookie.
4. Frontend sends the access token using the `Authorization: Bearer <token>` header.
5. When the access token expires, frontend can call `/auth/refresh-token`.

## Data Models

### User

- `name`
- `email`
- `password`
- `avatar`
- `role`
- `isVerified`
- `lastLogin`

### Conversation

- `userId`
- `title`
- `lastMessage`
- `lastMessageAt`
- `isPinned`

### Message

- `conversationId`
- `role`
- `content`
- `attachment`
- `model`
- `tokensUsed`

## Image Uploads

Images are accepted through Multer and uploaded to Cloudinary under:

```text
nova-ai/images
```

Gemini receives image input by reading temporary uploaded files and converting them to base64 inline data.

## Common Issues

### CORS error

Make sure the backend `.env` has the frontend URL:

```env
CLIENT_URL=
```

### MongoDB connection error

Check that `MONGODB_URI` is valid and the MongoDB cluster allows your IP address.

### Gemini error

Check that `GEMINI_API_KEY` is set and valid.

### Cloudinary upload error

Check:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Production Notes

- Use strong JWT secrets.
- Set `NODE_ENV=production`.
- Use HTTPS so secure cookies work correctly.
- Set `CLIENT_URL` to the deployed frontend origin.
- Do not commit `.env` files.
