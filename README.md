# Financial Application

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/PrajwalPohane/FinancialApplication)

A full-stack financial dashboard application designed for tracking and analyzing personal or business finances. This application features a secure Node.js backend with Express and a modern, responsive React frontend built with Vite and TypeScript.

## Key Features

- **Secure Authentication**: User registration and login using JSON Web Tokens (JWT) with RS256 encryption.
- **Transaction Management**: Perform full CRUD (Create, Read, Update, Delete) operations on your financial transactions.
- **Interactive Dashboard**: Get an at-a-glance overview of your financial health with key metrics and an interactive chart.
- **In-Depth Analytics**: Analyze your financial data with dynamic charts, category and status breakdowns, and flexible time-range filtering.
- **Data Export**: Export your transaction history or analytics reports to CSV format for record-keeping or further analysis.
- **Wallet Functionality**: A dedicated wallet page with quick actions like Send, Request, and Add Money.
- **Modern Tech Stack**: Built with TypeScript across the stack, featuring a React/Vite frontend and a Node.js/Express backend connected to MongoDB.
- **Modular UI**: Interactive modals for all major user actions, providing a smooth and intuitive user experience.

## Architecture

The repository is structured as a monorepo with two main packages:

-   `frontend/`: A client-side application built with React, Vite, and TypeScript. It handles the user interface and interacts with the backend API.
-   `backend/`: A server-side application built with Node.js, Express, and TypeScript. It provides a RESTful API for authentication, transaction management, and analytics, with data stored in MongoDB.

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16.20.1 or later)
-   [npm](https://www.npmjs.com/) (v8 or later)
-   A MongoDB connection string (from [MongoDB Atlas](https://www.mongodb.com/atlas) or a local instance)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/prajwalpohane/financialapplication.git
    cd financialapplication
    ```

2.  **Set up the Backend:**

    -   Navigate to the backend directory:
        ```sh
        cd backend
        ```
    -   Install dependencies:
        ```sh
        npm install
        ```
    -   Generate RSA keys for JWT authentication. These keys are used to sign and verify tokens securely.
        ```sh
        mkdir keys
        openssl genpkey -algorithm RSA -out keys/private_key.pem -pkeyopt rsa_keygen_bits:2048
        openssl rsa -pubout -in keys/private_key.pem -out keys/public_key.pem
        ```
    -   Create a `.env` file in the `backend` directory and add the following environment variables:
        ```env
        # Your MongoDB connection string
        MONGODB_URI=your_mongodb_connection_string

        # Frontend URL for CORS
        CORS_ORIGIN=http://localhost:5173

        # Port for the backend server
        PORT=5000
        ```
    -   Seed the database with initial user data (optional but recommended for demo):
        ```sh
        node createAdmin.js
        ```
    -   Build and run the server:
        ```sh
        npm run build
        npm start
        ```
    -   The backend server should now be running on `http://localhost:5000`.

3.  **Set up the Frontend:**

    -   In a new terminal, navigate to the frontend directory:
        ```sh
        cd frontend
        ```
    -   Install dependencies:
        ```sh
        npm install
        ```
    -   Run the development server:
        ```sh
        npm run dev
        ```
    -   The frontend application should now be running on `http://localhost:5173`.

### Usage

Once both the backend and frontend are running, open your browser to `http://localhost:5173`. You can log in using the demo credentials created by the seed script:

-   **Email:** `user1@example.com`
-   **Password:** `password1`

*You can also test with `user2@example.com` / `password2`, etc.*

After logging in, you can explore the dashboard, manage transactions, view analytics, and use the various features of the application.