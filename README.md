# Ecommerce Backend API

## Description
This project is a backend API for an ecommerce platform. It includes features for user authentication, product management, cart functionality, order processing, and more.

## Features
- **Authentication**: User registration, login, and token-based authentication (JWT).
- **Product Management**: CRUD operations for products.
- **Cart Management**: Add, update, and remove products from the cart.
- **Order Management**: Create, view, and manage user orders.
- **Pagination**: Supports paginated results for products, carts, and orders.

## Technologies
- **Node.js** with **Express** for backend development.
- **MongoDB** as the database.
- **Mongoose** for object modeling.
- **JWT** for secure authentication.
- **Bcrypt** for password hashing.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally or using a cloud service like MongoDB Atlas.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ecommerce-backend.git
   ```
2. Install dependencies:
   ```bash
    cd ecommerce-backend
    npm install
    ```
3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/ecommerce
    JWT_SECRET=your-secret-key
    ```
4. Start the server:
    ```bash
    npm start
    ```
5. The server should be running on `http://localhost:3000`.

## API Documentation
The API documentation is available in the [API Documentation](https://documenter.getpostman.com/view/28557407/2sAYBYgqud) file.
