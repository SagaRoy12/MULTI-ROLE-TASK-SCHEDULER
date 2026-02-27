# MULTI-ROLE-TASK-SCHEDULER
Multi role based (Super Admin , User) where Super admin can see all the users and Users can ad tasks according to the priority and update the task also . 
# MULTI-ROLE-TASK-SCHEDULER

A full-stack web application with role-based access control. Super Admin can manage users, and Users can create and manage their tasks with priority and status tracking.

---

## Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- cookie-parser
- swagger-ui-express + swagger-jsdoc

**Frontend**
- React.js with Vite
- TanStack Router
- TanStack Query
- Axios
- Tailwind CSS

---

## Project Structure
```
MULTI-ROLE-TASK-SCHEDULER/
├── BACKEND/
│   ├── src/
│   │   ├── conf/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── DAO/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── service/
│   │   └── app.js
│   └── package.json
├── FRONTEND/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── utility/
│   │   └── main.jsx
│   └── package.json
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Node.js v18 or above
- MongoDB Atlas account or local MongoDB instance
- npm

---

### Backend Setup

1. Navigate to the backend directory
```bash
cd BACKEND
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the BACKEND directory
```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret
ADMIN_CREATION_SECRET=your_admin_creation_secret
```

4. Start the backend server
```bash
npm run dev
```

Backend runs at `http://localhost:3000`

API documentation available at `http://localhost:3000/api-docs`

---

### Frontend Setup

1. Navigate to the frontend directory
```bash
cd FRONTEND
```

2. Install dependencies
```bash
npm install
```

3. Start the frontend
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API Routes

### Admin Routes — `/api/v1/admin_route`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /create_admin | Create a new admin | Secret header required |
| POST | /login_admin | Admin login | Public |
| GET | /seeAllUsers | Get all users | Admin only |
| DELETE | /delete_user/:id | Delete a user | Admin only |
| POST | /logout_admin | Admin logout | Admin only |
| POST | /refresh_token | Refresh access token | Public |

### User Routes — `/api/v1/user_route`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /create_user | Register a new user | Public |
| POST | /login_user | User login | Public |
| GET | /my_profile | Get user profile | User only |
| PATCH | /update_profile | Update user profile | User only |
| POST | /create_task | Create a task | User only |
| GET | /my_tasks | Get all user tasks | User only |
| GET | /task/:id | Get single task | User only |
| PUT | /task/:id | Update a task | User only |
| DELETE | /task/:id | Delete a task | User only |
| POST | /logout_user | User logout | User only |
| POST | /refresh_token | Refresh access token | Public |

---

## Creating the First Admin

Admin creation is protected by a secret header. Use Postman to create the first admin.
```
POST http://localhost:3000/api/v1/admin_route/create_admin

Header:
  admin_creation_secret: your_admin_creation_secret

Body:
{
  "name": "Super Admin",
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

---

## Docker Setup

Make sure Docker and Docker Compose are installed.

1. Create a `.env` file at the root of the project
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_CREATION_SECRET=your_admin_creation_secret
```

2. Build and run
```bash
docker-compose up --build
```

Frontend will be available at `http://localhost:80`

Backend will be available at `http://localhost:3000`

---

## Security

- Passwords are hashed using bcrypt before saving to the database
- JWT tokens are stored in httpOnly cookies to prevent XSS attacks
- Admin creation is protected by a secret key header
- Role-based middleware prevents unauthorized access to protected routes
- Input validation is applied at the service layer before database operations

---

## Scalability

See SCALABILITY.md for notes on how this project can be scaled for production.

---