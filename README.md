# 📚 Bookworm App – A Personal Reading Tracker (MERN Stack)

A full-stack reading tracker built with **MongoDB, Express, React, and Node.js**, featuring secure **JWT authentication**, user-friendly UI, and cloud-ready deployment support.

## 🔥 Features

### 📖 Book Management
- Add, edit, and delete books
- Track reading progress (pages read, completion status)
- Categorize books by genre, favorites, or custom tags

### 🔐 Secure Authentication
- JWT-based login/signup with persistent sessions
- Encrypted user data stored securely in tokens
- Protected API routes for authenticated access


## 🛠 Tech Stack

| Frontend         | Backend             | Database        | Authentication         |
|------------------|---------------------|------------------|--------------------------|
| React.js         | Node.js + Express   | MongoDB (Atlas) | JWT + Bcrypt (Hashing)  |
| React Router     | RESTful API         | Mongoose (ODM)  | Cookies (HTTP-only)     |

## ⚙️ Authentication Flow

### 🔹 Signup
1. User submits email + password
2. Server hashes password using Bcrypt
3. JWT token is generated and stored in an HTTP-only cookie
4. New user is added to MongoDB

### 🔹 Login
1. Server verifies credentials
2. On success, issues JWT token to client
3. All protected routes require this token in the request

# User Profile

![Screenshot 2025-06-10 181626](https://github.com/user-attachments/assets/e9de37bd-1068-40fd-bee5-e215103e56a3)

# Create Screen

![Screenshot 2025-06-10 174733](https://github.com/user-attachments/assets/f2466e40-b414-42e7-955f-4c925c484469)

# Home Screen

![Screenshot 2025-06-10 181626](https://github.com/user-attachments/assets/c8bb44f1-fa90-4e64-b0a9-f852e6031f3d)

## ▶️ How to Use the Project







