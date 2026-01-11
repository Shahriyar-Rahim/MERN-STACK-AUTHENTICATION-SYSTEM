# MERN Stack Authentication System

<!-- Header image: place your banner at `./assets/header.png` (recommended: 1200×360, PNG/JPG) -->
![Project Header](./public/screenshot.png)

A clean, production-ready authentication system built with the MERN stack (MongoDB, Express, React, Node). This repository demonstrates a complete authentication flow including registration, login, JWT access & refresh tokens, protected routes, password hashing, and a minimal role system — with separate frontend and backend folders and clear setup instructions.

Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Install & Run (Development)](#install--run-development)
  - [Run (Production Build)](#run-production-build)
- [API Reference (overview)](#api-reference-overview)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Folder Structure](#folder-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

About
This project serves as a reference implementation for user authentication using JWTs and refresh tokens in a MERN application. It can be used as a starter kit for new projects that require secure authentication and role-based access.

Features
- Email/password registration and login
- JSON Web Tokens (short-lived access token + refresh token)
- Token rotation / refresh endpoint
- Protected API routes (role-based access hints)
- Password hashing (bcrypt)
- Client-side protected routes (React Router)
- Example of server-side validation and client-side form validation
- Clean separation of frontend (/client) and backend (/server)

Tech Stack
- Frontend: React, React Router, Axios, Context or Redux (optional)
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: JWT, bcrypt
- Dev tooling: nodemon, concurrently (optional)

Architecture
- Frontend (client) handles UI, forms, stores access token in memory (recommended) and sends refresh token as httpOnly cookie (recommended).
- Backend (server) handles authentication logic, issues short-lived access tokens and long-lived httpOnly refresh tokens, stores minimal refresh token identifiers (or uses rotation patterns).

Getting Started

Prerequisites
- Node.js (>= 16)
- npm or yarn
- MongoDB (local or hosted, e.g., MongoDB Atlas)
- (Optional) yarn or pnpm

Environment Variables
Create .env files for the frontend and backend as below.

Example: /server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/auth-demo?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
COOKIE_SECURE=false # set to true in production with HTTPS
```

Example: /client/.env (React)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Install & Run (Development)
1. Clone the repo
   ```
   git clone https://github.com/Shahriyar-Rahim/MERN-STACK-AUTHENTICATION-SYSTEM.git
   cd MERN-STACK-AUTHENTICATION-SYSTEM
   ```

2. Start the backend
   ```
   cd backend
   npm install
   npm run dev        # or `node index.js` / `npm start`
   ```

3. Start the frontend
   ```
   cd ../frontend
   npm install
   npm start
   ```

Tip: You can run both concurrently from the root if a script is provided (e.g., `npm run dev` using `concurrently`).

Run (Production Build)
- Build the React app and serve static files from the backend or deploy separately.
  ```
  # from /backend
  npm run build
  # copy build/ to server/public or configure server to serve client/build
  ```

API Reference (overview)
- POST /api/auth/register — Register a new user
- POST /api/auth/login — Authenticate and issue tokens
- POST /api/auth/refresh — Exchange refresh token (httpOnly cookie) for new access token
- POST /api/auth/logout — Invalidate refresh token / clear cookie
- GET /api/users/me — Get current user's profile (protected)

Note: Exact endpoints and request/response schemas depend on implementation in /server. Use Postman or similar to test.

Frontend Overview
- Example pages:
  - /login — Login form (posts credentials to /api/auth/login)
  - /register — Registration form
  - /dashboard — Example protected route (fetches /api/users/me)
- Authentication flow:
  - On login, server returns access token (in response) and sets httpOnly refresh token cookie.
  - Frontend stores access token in app memory (or secure storage) and attaches it to Authorization header.
  - When access token expires, frontend requests POST /api/auth/refresh (cookies sent automatically) to obtain a new access token.

Backend Overview
- Responsibilities:
  - Validate input, hash passwords, store users in MongoDB
  - Issue JWT access tokens (short expiration) and refresh tokens (longer expiration)
  - Securely store/validate refresh tokens (in DB or via rotation)
  - Middleware for verifying access token on protected routes
- Security recommendations:
  - Keep secrets out of source control (use environment variables)
  - Use httpOnly, Secure cookies for refresh tokens
  - Implement rate limiting and brute-force protections on auth endpoints
  - Use HTTPS in production and set cookie `secure: true`

Folder Structure (suggested)
```
/frontend                 # React app
  /public
  /src
    /components
    /pages
    /services
    /context or /store

/backend                 # Express API
  /config
  /controllers
  /models
  /routes
  /middleware
  index.js or app.js
```

Testing
- Backend: use Jest / Supertest for API tests and auth flows.
- Frontend: use React Testing Library for component and route tests.
- Add a Postman collection or OpenAPI spec for manual testing.

Deployment
- Option 1: Deploy frontend (Vercel, Netlify) and backend (Heroku, Render, DigitalOcean) separately and configure CORS and cookie domains.
- Option 2: Serve built frontend from backend (Express static) and deploy as single app (e.g., on Render or a VPS).
- Ensure environment variables and secrets are set in the hosting provider.

Contributing
Contributions welcome. Please follow these steps:
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes and push: `git push origin feat/your-feature`
4. Open a Pull Request with a clear description and testing steps

License
This project is provided under the MIT License. See the [LICENSE](./LICENSE) file for details.

Contact
Maintainer: Shahriyar-Rahim  
Repository: [MERN-STACK-AUTHENTICATION-SYSTEM](https://github.com/Shahriyar-Rahim/MERN-STACK-AUTHENTICATION-SYSTEM)

Acknowledgements
- Inspired by common MERN authentication patterns and community best practices.
