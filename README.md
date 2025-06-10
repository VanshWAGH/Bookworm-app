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
| React Native        | Node.js + Express   | MongoDB (Atlas) | JWT + Bcrypt (Hashing)  |
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

![Screenshot 2025-06-10 180555](https://github.com/user-attachments/assets/c7b6159c-1bfa-40e8-bc91-0814882da76e)


### 1️⃣ Clone & Setup
```bash
git clone https://github.com/VanshWAGH/Bookworm-app.git
cd Bookworm



2️⃣ Run Backend Server

cd backend
npm install
npm run dev


3️⃣ Run Mobile App
bash
cd mobile
npx expo install
npx expo start

Then:

-Scan QR code with Expo Go app (mobile)

-Or press w for web browser


🌐 API Configuration
Edit 

javascript
// For local development:
-const API_URL = "http://localhost:3000"; 

// For deployed backend:
-const API_URL = "https://reactnative-bookworm.onrender.com";













