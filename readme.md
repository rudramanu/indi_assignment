# API Documentation

## Overview

This document provides detailed information about the API endpoints and operations for your API titled "Your API Title." This API allows users to perform various actions related to user registration, authentication, book management, and borrowing history.

### Base URL

The base URL for this API is:

- `http://localhost:YOUR_PORT` (Update `YOUR_PORT` with the actual port where your API is running)

## Paths

### `/home`

- **HTTP Method**: `GET`
- **Summary**: Check if APIs are working
- **Responses**:
  - `200`: API is working
  - `500`: Internal Server Error

### `/user/register`

- **HTTP Method**: `POST`
- **Summary**: Register a new user
- **Request Body**:
  - `name` (string, required): The user's name
  - `email` (string, required): The user's email address
  - `password` (string, required): The user's password
- **Responses**:
  - `200`: User Registered
  - `409`: Conflict - User already exists or missing fields
  - `500`: Internal Server Error

### `/user/login`

- **HTTP Method**: `POST`
- **Summary**: Login as a user
- **Request Body**:
  - `email` (string, required): The user's email address
  - `password` (string, required): The user's password
- **Responses**:
  - `200`: Logged in successfully
    - `message` (string): Message indicating successful login
    - `name` (string): The user's name
    - `token` (string): Authentication token
  - `404`: User not found
  - `403`: Wrong credentials
  - `409`: Conflict - Missing fields
  - `500`: Internal Server Error

### `/book/add`

- **HTTP Method**: `POST`
- **Summary**: Add a new book
- **Security**: Token-based authentication
- **Request Body**:
  - `ISBN` (string): The book's ISBN
  - `title` (string): The book's title
  - `author` (string): The book's author
  - `publishedYear` (integer): The year the book was published
  - `quantity` (integer): The quantity of the book
- **Responses**:
  - `200`: Product added
  - `500`: Internal Server Error

### `/book/update/{id}`

- **HTTP Method**: `PUT`
- **Summary**: Update a book
- **Security**: Token-based authentication
- **Path Parameter**:
  - `id` (string, required): The ID of the book to be updated
- **Request Body**:
  - `ISBN` (string): The book's ISBN
  - `title` (string): The book's title
  - `author` (string): The book's author
  - `publishedYear` (integer): The year the book was published
  - `quantity` (integer): The quantity of the book
- **Responses**:
  - `200`: Product Updated Successfully
  - `500`: Internal Server Error

### `/book/delete/{id}`

- **HTTP Method**: `DELETE`
- **Summary**: Delete a book
- **Security**: Token-based authentication
- **Path Parameter**:
  - `id` (string, required): The ID of the book to be deleted
- **Responses**:
  - `200`: Product Removed Successfully
  - `500`: Internal Server Error

### `/book/get`

- **HTTP Method**: `GET`
- **Summary**: Get all available books
- **Responses**:
  - `200`: List of available books (array of book objects)
  - `500`: Internal Server Error

### `/book/search`

- **HTTP Method**: `GET`
- **Summary**: Search for books
- **Query Parameter**:
  - `q` (string, required): The search query
- **Responses**:
  - `200`: List of search results (array of book objects)
  - `500`: Internal Server Error

### `/history/borrow/{bookId}`

- **HTTP Method**: `POST`
- **Summary**: Borrow a book
- **Security**: Token-based authentication
- **Path Parameter**:
  - `bookId` (string, required): The ID of the book to be borrowed
- **Request Body**:
  - `userId` (string): The ID of the user borrowing the book
- **Responses**:
  - `200`: You just borrowed a book
  - `400`: Bad Request - Maximum limit reached
  - `404`: Book not found or not available for borrowing
  - `500`: Internal Server Error

### `/history/return/{borrowId}`

- **HTTP Method**: `POST`
- **Summary**: Return a borrowed book
- **Security**: Token-based authentication
- **Path Parameter**:
  - `borrowId` (string, required): The ID of the borrowing record to be updated
- **Request Body**:
  - `userId` (string): The ID of the user returning the book
- **Responses**:
  - `200`: Book returned successfully
  - `404`: Borrowing record not found
  - `500`: Internal Server Error

### `/history/recommendations`

- **HTTP Method**: `GET`
- **Summary**: Get book recommendations
- **Security**: Token-based authentication
- **Query Parameter**:
  - `userId` (string, required): The ID of the user for whom recommendations are requested
- **Responses**:
  - `200`: Recommended books (array of book objects)
  - `500`: Internal Server Error
