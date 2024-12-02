
# **Ecommerce API Documentation**

This API provides endpoints for managing users, products, carts, and authentication in an ecommerce application.

---

## **Folder Descriptions**

### **1. Auth Folder (`/auth`)**
Contains modules and controllers related to user authentication and authorization.  
- **Responsibilities**:
  - User registration and login.
  - Password hashing and verification.
  - Email verification and password reset. (in progress)
  - Token-based authentication (JWT).

---

### **2. User Folder (`/users`)**
Manages user-related operations and profiles.  
- **Responsibilities**:
  - Fetching user data (all users or specific users).
  - User profile updates and deletions.
  - Admin access to user management.

---

### **3. Product Folder (`/products`)**
Handles all product-related functionalities.  
- **Responsibilities**:
  - Managing product inventory.
  - Fetching product lists (paginated) or specific product details.
  - Admin features: Adding, updating, and deleting products.

---

### **4. Cart Folder (`/carts`)**
Facilitates cart management for users.  
- **Responsibilities**:
  - Creating and managing user-specific carts.
  - Adding, updating, or removing products in the cart.
  - Fetching cart details.

---

## **Authentication (Auth) API**

### **Endpoints Overview**

| Endpoint          | Method | Description                  |
|-------------------|--------|------------------------------|
| `/auth/register`  | POST   | Register a new user.         |
| `/auth/login`     | POST   | Login and get an access token. |
| `/auth/verify`    | GET    | Verify email address.        |
| `/auth/reset`     | POST   | Request password reset.      |

---

### **1. Register a User**

**Method**: `POST`  
**Endpoint**: `/auth/register`  
**Description**: Register a new user.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "User registered successfully"
}
```

---

### **2. Login**

**Method**: `POST`  
**Endpoint**: `/auth/login`  
**Description**: Login with email and password.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "status": "success",
  "token": "JWT_ACCESS_TOKEN"
}
```

---

## **User API**

### **Endpoints Overview**

| Endpoint          | Method | Description                   |
|-------------------|--------|-------------------------------|
| `/users`          | GET    | Fetch all users (admin only). |
| `/users/:id`      | GET    | Fetch a specific user.        |
| `/users/:id`      | PUT    | Update user information.      |
| `/users/:id`      | DELETE | Delete a user.                |

---

### **1. Get All Users**

**Method**: `GET`  
**Endpoint**: `/users`  
**Description**: Fetch all users (admin access required).

**Headers**:
- `Authorization`: Bearer `<JWT token>`.

**Response**:
```json
{
  "status": "success",
  "data": [
    { "id": "user1", "name": "John Doe", "email": "john@example.com" },
    { "id": "user2", "name": "Jane Doe", "email": "jane@example.com" }
  ]
}
```

---

## **Product API**

### **Endpoints Overview**

| Endpoint          | Method | Description                    |
|-------------------|--------|--------------------------------|
| `/products`       | GET    | Fetch all products (paginated). |
| `/products/:id`   | GET    | Fetch a specific product by ID. |
| `/products`       | POST   | Create a new product (admin).  |
| `/products/:id`   | PATCH    | Update an existing product (admin). |
| `/products/:id`   | DELETE | Delete a product (admin).      |

---

### **1. Get All Products**

**Method**: `GET`  
**Endpoint**: `/products`  
**Description**: Fetch all products with pagination.

**Query Parameters**:
- `page` (optional): The page number (default: 1).
- `limit` (optional): The number of items per page (default: 10).

**Response**:
```json
{
  "status": "success",
  "data": [
    { "id": "prod1", "name": "Product A", "price": 100, "stock": 20 },
    { "id": "prod2", "name": "Product B", "price": 200, "stock": 15 }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

---

## **Cart API**

### **Endpoints Overview**

| Endpoint          | Method | Description                       |
|-------------------|--------|-----------------------------------|
| `/carts`          | GET    | Fetch all carts (admin only).     |
| `/carts/:id`      | GET    | Fetch a specific cart by ID.      |
| `/carts`          | POST   | Create a cart for a user.         |
| `/carts/:id`      | PUT    | Update the cart (replace items).  |
| `/carts/:id/push` | PUT    | Add items to the cart.            |
| `/carts/:id`      | DELETE | Delete a cart.                   |

---

### **1. Get Cart by ID**

**Method**: `GET`  
**Endpoint**: `/carts/:id`  
**Description**: Retrieve a specific cart by its ID.

**Headers**:
- `Authorization`: Bearer `<JWT token>`.

**Response**:
```json
{
  "status": "success",
  "data": {
    "id": "cart1",
    "userId": "user1",
    "products": [
      { "productId": "prod1", "quantity": 2 },
      { "productId": "prod2", "quantity": 1 }
    ]
  }
}
```
