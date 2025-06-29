# Financial Dashboard Frontend

This is the frontend for the Financial Analytics Dashboard, built with React, TypeScript, and Vite.

## Backend Connection

The frontend connects to a Node.js/Express backend with TypeScript. The backend provides the following API endpoints:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Transaction Endpoints
- `GET /api/transactions` - Get transactions with pagination and filtering
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/analytics` - Get financial analytics
- `GET /api/transactions/export` - Export transactions to CSV

## API Service Layer

The frontend uses a centralized API service (`src/services/api.ts`) that handles:

- Authentication token management
- Request/response typing with TypeScript
- Error handling and user feedback
- CSV export functionality

## Authentication Flow

1. User enters credentials on login page
2. Frontend calls `POST /api/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. Token is automatically included in subsequent API requests
6. Token validation happens on app startup

## Key Features Connected to Backend

### 1. Authentication
- Real login/logout with JWT tokens
- Automatic token validation
- User profile management

### 2. Transactions
- Real-time transaction data from MongoDB
- Pagination and filtering
- CRUD operations
- CSV export functionality

### 3. Analytics
- Real financial analytics from backend
- Time range filtering
- Summary statistics
- Chart data generation

## Setup Instructions

1. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Seed the Database:**
   ```bash
   cd backend
   npm run seed
   ```

3. **Start the Frontend:**
   ```bash
   cd frontend_bolt
   npm install
   npm run dev
   ```

4. **Login with Demo Credentials:**
   - Email: `admin@example.com`
   - Password: `password123`

## Environment Configuration

The frontend is configured to connect to the backend at `http://localhost:5000/api`. If you need to change this, update the `API_BASE_URL` in `src/services/api.ts`.

## Data Flow

1. **Login:** User credentials → Backend validation → JWT token → Frontend storage
2. **Transactions:** Frontend request → Backend query → MongoDB → Filtered response → Frontend display
3. **Analytics:** Frontend request → Backend aggregation → MongoDB → Calculated metrics → Frontend charts
4. **Export:** Frontend request → Backend CSV generation → File download

## Error Handling

- Network errors are caught and displayed as toast notifications
- Authentication errors redirect to login
- API errors show user-friendly messages
- Loading states provide feedback during requests

## Security Features

- JWT token authentication
- Automatic token inclusion in requests
- Token validation on app startup
- Secure logout (token removal) 