# Banking Accounts Mini Backend

REST API for a banking account system with transaction-safe money transfers.

## Tech Stack

- Node.js
- Express 5
- PostgreSQL
- pg (node-postgres)
- dotenv
- nodemon

## Features

- Customer management
- Multiple accounts per customer (AMD, USD, EUR)
- Deposit, withdraw, and atomic transfers
- Row-level locking to prevent race conditions
- Audit log for every operation
- Reference uniqueness to prevent duplicate transactions

## Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 2. Clone the repository

git clone <repo-url>
cd banking-api

### 3. Install dependencies

npm install

### 4. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

cp .env.example .env

### 5. Create the database

psql -c "CREATE DATABASE banking_assignment"
psql banking_assignment -f db/sql/tables.sql
psql banking_assignment -f db/sql/seed.sql

### 6. Start the server

npm run dev

Server will be running at `http://localhost:3000`.

## API Documentation

### Base URL

http://localhost:3000/api

### Customers

POST /customers
GET /customers/:id

### Accounts

POST /accounts
GET /accounts/:id
PATCH /accounts/:id/status

### Transactions

POST /accounts/:id/deposit
POST /accounts/:id/withdraw
POST /transfers

## Example Requests

### Create a customer

curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Hakob", "email": "hakob@test.com"}'

### Deposit

curl -X POST http://localhost:3000/api/accounts/1/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "reference": "DEP-001"}'

### Transfer

curl -X POST http://localhost:3000/api/transfers \
  -H "Content-Type: application/json" \
  -d '{"fromAccountId": 1, "toAccountId": 2, "amount": 1000, "reference": "TR-001"}'

## Database Schema

### customers
- id (PK)
- full_name, email (unique), phone, created_at

### accounts
- id (PK)
- customer_id (FK -> customers.id)
- currency (CHECK: AMD, USD, EUR)
- balance (CHECK >= 0)
- status (CHECK: active, frozen, closed)

### transactions
- id (PK)
- type (CHECK: deposit, withdraw, transfer)
- from_account_id, to_account_id (FK -> accounts.id)
- amount (CHECK > 0)
- reference (unique)

### audit_logs
- id (PK)
- action, meta (JSONB), created_at

## Transaction Safety

Transfers use PostgreSQL transactions with `BEGIN` / `COMMIT` / `ROLLBACK`.
Accounts are locked with `SELECT ... FOR UPDATE` to prevent race conditions.