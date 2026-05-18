# TalentPulse AI - Employee Performance Analytics & Recommendation System

## Overview
TalentPulse AI is a complete MERN stack application designed for HR/Admin users to manage employee performance, conduct analytics, and generate AI-powered recommendations for promotions and training.

## Tech Stack
* **Frontend**: React.js (Vite), Tailwind CSS v4, React Router, Axios, Lucide React (Icons)
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose)
* **Authentication**: JWT token-based authentication, bcryptjs for password hashing
* **AI Integration**: OpenRouter API (Google/Gemini model by default)

## Core Features
* **Secure Authentication**: JWT-protected routes, password hashing.
* **Employee Management**: Full CRUD operations for employees, including dynamic inline updating of performance scores.
* **Analytics Dashboard**: View top performers, average scores, and search/filter employees by department, skills, and minimum performance score.
* **AI Recommendations**: Generate intelligent insights for promotion eligibility and training needs based on the employee's profile.

## Setup Instructions

### 1. Prerequisites
Ensure you have Node.js and MongoDB installed (or a MongoDB Atlas connection string).

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Rename `.env.example` to `.env` (or edit the existing `.env` file).
4. Update the `.env` variables:
   - `MONGO_URI`: Your MongoDB connection string.
   - `OPENROUTER_API_KEY`: Your OpenRouter API key.
   - `JWT_SECRET`: A secret key for JWT (e.g., `supersecretkey`).
5. Run `npm start` (or `node server.js` / `nodemon server.js`) to start the backend on port 5000.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the Vite development server.
4. Access the app in your browser at `http://localhost:5173`.

## Application Flow
1. **Signup/Login**: Create a new HR/Admin account or login with an existing one.
2. **Dashboard**: View the list of employees. If none exist, click "+ Add New" to register an employee.
3. **Analytics**: Observe the top cards to see average performance and top performer. Use the filter section to narrow down employees by department or skills.
4. **Dynamic Update**: Click the pencil icon next to an employee's performance score to update it in real-time.
5. **AI Insights**: Click the "AI Insights" button on any employee row to open a modal. The backend will securely call OpenRouter and return an AI analysis of the employee's potential.
