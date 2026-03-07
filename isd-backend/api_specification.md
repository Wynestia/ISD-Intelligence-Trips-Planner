# User API Specification

This document details the API endpoints for managing Users in the system.

## Base URL
All endpoints are relative to the base URL:
`http://localhost:3123`

---

## 1. List All Users
Retrieves a list of all registered users.

- **URL:** `/users`
- **Method:** `GET`
- **Auth Required:** No (Currently public)

### response
**Code:** `200 OK`
**Content:** Array of User objects
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "hashed_password"
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "hashed_password"
  }
]
```

---

## 2. Get User by ID
Retrieves details of a specific user by their unique ID.

- **URL:** `/users/:id`
- **Method:** `GET`
- **URL Params:**
  - `id` (numeric, required): The unique ID of the user.

### Response
**Code:** `200 OK`
**Content:** User object
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password"
}
```

**Code:** `404 Not Found` (If user does not exist - dependent on default Prisma behavior)

---

## 3. Create User
Registers a new user in the system.

- **URL:** `/users`
- **Method:** `POST`
- **Body:** JSON object
  - `name` (string, required): Full name of the user.
  - `email` (string, required, format: email): Unique email address.
  - `password` (string, required): User's password (should be hashed in production).

### Request Body Example
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "securepassword123"
}
```

### Response
**Code:** `200 OK` (or `201 Created` depending on Elysia default)
**Content:** Created User object
```json
{
  "id": 3,
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "securepassword123"
}
```

---

## 4. Update User
Updates an existing user's information.

- **URL:** `/users/:id`
- **Method:** `PUT`
- **URL Params:**
  - `id` (numeric, required): The unique ID of the user.
- **Body:** JSON object (All fields are optional)
  - `name` (string, optional)
  - `email` (string, optional, format: email)
  - `password` (string, optional)

### Request Body Example
```json
{
  "name": "Alice Johnson"
}
```

### Response
**Code:** `200 OK`
**Content:** Updated User object
```json
{
  "id": 3,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "securepassword123"
}
```

---

## 5. Delete User
Removes a user from the system.

- **URL:** `/users/:id`
- **Method:** `DELETE`
- **URL Params:**
  - `id` (numeric, required): The unique ID of the user.

### Response
**Code:** `200 OK`
**Content:** Deleted User object
```json
{
  "id": 3,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "securepassword123"
}
```
