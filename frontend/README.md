# Nova AI Workspace Frontend

React frontend for Nova AI Workspace. It provides a professional AI chat interface with authentication, saved conversations, markdown rendering, Gemini-style code blocks, image attachments, and Redux-powered app state.

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Redux Toolkit
- React Redux
- React Router
- Axios
- Lucide React icons
- React Markdown
- Remark GFM
- React Syntax Highlighter

## Folder Structure

```text
frontend/
  src/
    components/      Shared UI components
    config/          API and storage config
    features/
      auth/          Auth layout, form, and Redux slice
      chat/          Sidebar, chat window, composer, messages, chat slice
    lib/             Browser storage helpers
    pages/           Route pages
    routes/          Protected and guest route guards
    services/        Axios API services
    store/           Redux store setup
    styles/          Tailwind entry and global CSS
    utils/           Utility helpers
    App.jsx          Main route tree
    main.jsx         React entry point
  index.html
  package.json
  tailwind.config.js
  vite.config.js
```

## Getting Started

Install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # Create production build
npm run preview   # Preview production build locally
```

## Environment Variables

| Variable            | Description          | Example                        |
| ------------------- | -------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` |

## Main Features

### Authentication

- Register account
- Login
- Logout
- Persist access token in local storage
- Load current user
- Protected workspace route
- Guest-only login/register routes
- Automatic access token refresh attempt through backend refresh cookie

### AI Workspace

- New chat
- Saved conversation list
- Search conversations
- Open previous chats
- Pin and unpin conversations
- Rename conversations
- Delete conversations from frontend state and API
- Sidebar profile section
- Sidebar logout action

### Chat Experience

- Clean assistant and user message bubbles
- Markdown rendering
- Tables, lists, links, headings, and GitHub-flavored markdown support
- Gemini-style code blocks
- Syntax highlighting
- Copy code button
- Horizontal code scrolling
- Auto-scroll to latest message
- Image attachment support

## API Integration

The frontend talks to these backend route groups:

```text
/auth
/conversation
/message
/ai
```

Axios is configured in:

```text
src/services/apiClient.js
```

It sends:

```text
Authorization: Bearer <access_token>
```

and enables:

```js
withCredentials: true;
```

so the backend refresh-token cookie can be used.

## Important Files

### Auth

```text
src/features/auth/authSlice.js
src/features/auth/AuthForm.jsx
src/features/auth/AuthLayout.jsx
src/services/authService.js
```

### Chat

```text
src/features/chat/chatSlice.js
src/features/chat/ChatSidebar.jsx
src/features/chat/ChatWindow.jsx
src/features/chat/ChatComposer.jsx
src/features/chat/MessageBubble.jsx
src/services/chatService.js
```

### Styling

```text
src/styles/index.css
tailwind.config.js
```

## Design Notes

- The app uses a workspace-first layout, not a landing page.
- Sidebar is fixed on desktop and contains conversations plus profile/logout.
- The chat panel is the main scroll container.
- Code blocks use a light rounded panel style similar to Gemini.
- Icons come from Lucide React.
- TailwindCSS handles layout, color, spacing, and animation utilities.

## Backend Requirements

The backend must be running at the URL configured in:

```env
VITE_API_BASE_URL
```

For local development, backend CORS must allow:

```env
CLIENT_URL=
```

## Common Issues

### Login works but `/auth/me` fails

Check that the access token exists in local storage and the backend accepts `Authorization: Bearer <token>`.

### Refresh token does not work

Make sure:

- Backend CORS has `credentials: true`
- Frontend Axios has `withCredentials: true`
- Browser is not blocking cookies
- Backend `CLIENT_URL` matches the frontend origin

### Chat response does not appear

Check:

- Backend server is running
- `VITE_API_BASE_URL` is correct
- User is logged in
- Gemini API key is valid in backend `.env`

### Image upload fails

Check Cloudinary environment variables in the backend.

### Delete chat does not work

The frontend calls `DELETE /conversation/:id`. If deletion fails, check the backend conversation route file for route conflicts between rename and delete.

## Production Notes

- Build with `npm run build`.
- Deploy the `dist` folder.
- Set `VITE_API_BASE_URL` to the deployed backend API URL.
- Configure backend CORS `CLIENT_URL` to the deployed frontend URL.
- Do not commit frontend `.env` files.
