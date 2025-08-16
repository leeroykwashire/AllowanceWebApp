# API Integration Guide

This document provides guidance on the key API endpoints for integrating the frontend ReactJS application with the Django REST API backend. It outlines the purpose, request/response formats, and authentication requirements for each endpoint.

---

## Authentication Endpoints

### 1. Register User
- **Endpoint:** `POST /api/auth/register/`
- **Purpose:** Create a new user account
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "password": "string",
    "password_confirm": "string"
  }
  ```
- **Response:**
  - User details
  - JWT access and refresh tokens

### 2. Login User
- **Endpoint:** `POST /api/auth/login/`
- **Purpose:** Authenticate user and obtain JWT tokens
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  - User details
  - JWT access and refresh tokens

---

## Transaction Endpoints

### 3. Calculate Transaction
- **Endpoint:** `POST /api/transactions/calculate/`
- **Purpose:** Calculate fees and final amount for a transfer
- **Auth:** Bearer JWT required
- **Request Body:**
  ```json
  {
    "amount_usd": "decimal",
    "target_currency": "GBP" | "ZAR",
    "recipient_name": "string"
  }
  ```
- **Response:**
  - Fee, exchange rate, final amount, etc.

### 4. Create Transaction
- **Endpoint:** `POST /api/transactions/send/`
- **Purpose:** Create a new money transfer transaction
- **Auth:** Bearer JWT required
- **Request Body:** Same as calculate
- **Response:**
  - Transaction details

### 5. Transaction History
- **Endpoint:** `GET /api/transactions/history/?page=1`
- **Purpose:** Get paginated list of user's past transactions
- **Auth:** Bearer JWT required
- **Response:**
  - List of transactions, pagination info

### 6. Transaction Detail
- **Endpoint:** `GET /api/transactions/{uuid}/`
- **Purpose:** Get details for a specific transaction
- **Auth:** Bearer JWT required
- **Response:**
  - Transaction details

---

## FX Rates Endpoint

### 7. Get Exchange Rates
- **Endpoint:** `GET /api/exchange-rates/`
- **Purpose:** Retrieve current GBP and ZAR rates
- **Response:**
  - List of rates

---

## Advertisement Endpoint

### 8. Get Advertisements
- **Endpoint:** `GET /api/advertisements/`
- **Purpose:** Retrieve active advertisements for carousel
- **Response:**
  - List of ads

---

## Authentication Notes
- All protected endpoints require the `Authorization: Bearer <access_token>` header
- JWT tokens are received on registration/login and must be stored securely in the frontend

## Error Handling
- API returns standard HTTP status codes
- Error responses include helpful messages for frontend display

## Next Steps
- Use RTK Query to define services for each endpoint
- Handle authentication, error, and loading states in the frontend
- Test all endpoints with sample data before production

---

This guide should be referenced when implementing API calls in the frontend to ensure correct integration and a smooth user experience.
