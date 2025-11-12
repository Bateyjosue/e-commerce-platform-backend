# E-Commerce Platform Backend

This repository contains the backend API for a robust and scalable e-commerce platform. It provides a full suite of services for managing users, products, and orders, built with a modern, production-ready technology stack.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose for object data modeling (ODM).
- **Authentication**: JSON Web Tokens (JWT) for secure, stateless user authentication.
- **Image Management**: Cloudinary for cloud-based image uploads and transformations.
- **Caching**: Redis for high-performance caching of frequently accessed data (e.g., product listings).
- **API Documentation**: Swagger (OpenAPI) for interactive and auto-generated API documentation.
- **Security**: Includes `helmet` for setting secure HTTP headers, `express-mongo-sanitize` to prevent NoSQL injection, and `express-rate-limit` to mitigate brute-force attacks.

---

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (either running locally or a cloud instance like MongoDB Atlas)
- [Redis](https://redis.io/docs/getting-started/) (either running locally or a cloud instance)

---

## Local Setup and Installation

Follow these steps to get your development environment set up and running:

1.  **Clone the Repository**
    ```sh
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install Dependencies**
    Using npm, install all the required packages from `package.json`.
    ```sh
    npm install
    ```

3.  **Create Environment Variables File**
    Create a `.env` file in the root of your project. This file will store all the necessary secrets and configuration variables. Copy the contents from the `.env.example` below.
    ```sh
    touch .env
    ```

4.  **Populate the `.env` File**
    Paste the following into your `.env` file and replace the placeholder values with your actual credentials.

    ```env
    # MongoDB Connection
    MONGO_URI=your_mongodb_connection_string

    # JWT Configuration
    JWT_SECRET=your_super_secret_jwt_key
    JWT_LIFETIME=1d

    # Cloudinary Credentials (for image uploads)
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # Redis Connection URL (for caching)
    REDIS_URI=your_redis_connection_url
    ```

5.  **Run the Development Server**
    This command starts the server with `nodemon`, which will automatically restart the application whenever you make changes to the code.
    ```sh
    npm run start:dev
    ```

The server will start on port 3000.

---

## Available Scripts

- "start:dev": "npx nodemon",
- "build": "npx rimraf ./dist && tsc",
- "start": "node dist/server.js"

---

## API Documentation

This project uses `swagger-jsdoc` and `swagger-ui-express` to provide live, interactive API documentation.

Once the server is running, you can access the full API documentation by navigating to:

**http://localhost:3000/api-docs**
