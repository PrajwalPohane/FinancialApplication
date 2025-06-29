# Financial Dashboard App

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack financial dashboard application with a modern React frontend and a secure Node.js/Express backend using MongoDB Atlas. Features user authentication, transaction management, analytics, CSV export, and more.

## Features
- User authentication (JWT)
- Add, edit, delete, and view transactions
- Dynamic analytics and charts
- Export transactions and analytics as CSV
- Accessibility and responsive design
- Filter, sort, and search transactions
- Wallet and quick actions
- Category and status breakdowns

## Folder Structure
```
fin/
  backend/           # Node.js/Express/MongoDB backend
  frontend_bolt/     # React + TypeScript frontend
  transactions.json  # Sample data
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone "https://github.com/PrajwalPohane/FinancialApplication.git"
cd fin
```

### 2. Backend Setup
```bash
cd backend
npm install
# Copy and edit environment variables
cp config.env.example config.env
# Set MONGODB_URI, JWT_SECRET, etc. in config.env
npm run build
npm start
```

#### Backend Environment Variables (`backend/config.env`)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend_bolt
npm install
npm run dev
```

- The frontend will run on [http://localhost:5173](http://localhost:5173)
- The backend will run on [http://localhost:5000](http://localhost:5000)

## Usage
- Register or login with demo credentials
- Add, edit, delete, and view transactions
- Explore analytics and export reports

## License
MIT 