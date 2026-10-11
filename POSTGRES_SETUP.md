# 🗄️ PostgreSQL Real Database Connection Guide for MediBridge

This document provides step-by-step instructions on connecting the **MediBridge** platform to a **real PostgreSQL production database**.

---

## 🛠️ Step 1: Obtain Your PostgreSQL Connection String

You can use any of the following 3 options:

### Option A: Hosted Cloud Database (Recommended - Free & Fast)
You can create a free PostgreSQL database on platforms like **Supabase**, **Neon.tech**, **Render**, or **ElephantSQL**:
1. Sign up at [Supabase.com](https://supabase.com) or [Neon.tech](https://neon.tech).
2. Create a new project named `medibridge`.
3. Copy your database connection URL. It will look like:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/medibridge?schema=public&sslmode=require"
   ```

### Option B: Local PostgreSQL Installation
If you have PostgreSQL installed locally on your Windows computer:
1. Open **pgAdmin** or your terminal.
2. Create a database named `medibridge`:
   ```sql
   CREATE DATABASE medibridge;
   ```
3. Your connection string will look like:
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/medibridge?schema=public"
   ```

### Option C: Docker PostgreSQL Container
If you have Docker installed on your machine, you can launch the included PostgreSQL container with one command:
```bash
docker-compose up -d postgres
```
This automatically starts PostgreSQL on `localhost:5432` with credentials:
```env
DATABASE_URL="postgresql://medibridge:medibridge_secret_pass@localhost:5432/medibridge_db?schema=public"
```

---

## ⚙️ Step 2: Configure Environment Variables

Open the `.env` file in the `backend/` directory (`backend/.env`) and update the `DATABASE_URL` with your connection string:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_key_medibridge_2026
JWT_EXPIRES_IN=7d

# Paste your real PostgreSQL connection URL here:
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/medibridge?schema=public"

ML_SERVICE_URL=http://localhost:8000
```

---

## 🚀 Step 3: Run Database Migrations & Seed Data

Open your terminal in the `backend/` directory and execute:

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Apply Prisma database migrations to create all tables
npx prisma migrate dev --name init

# 4. Seed database with master medicines, initial users, pharmacies, NGOs, and guides
npm run seed
```

---

## 🔐 Step 4: Access Ready-to-Use Demo Accounts

After running `npm run seed`, your real database will be populated with the following demo accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@medibridge.org` | `Password123!` | Full Admin Operations & Side-by-Side OCR Verification Center |
| **DONOR** | `donor@medibridge.org` | `Password123!` | Medicine Donation Submission & Batch Expiry Tracking |
| **USER** | `user@medibridge.org` | `Password123!` | Medicine Search, Recipient Requests & Orders |
| **PHARMACY** | `pharmacy@medibridge.org` | `Password123!` | Pharmacy Inventory Stock Management & Order Processing |
| **NGO** | `ngo@medibridge.org` | `Password123!` | Community Donation Allocation & Bulk Distribution |
| **HOSPITAL** | `hospital@medibridge.org` | `Password123!` | Emergency Supply Requisition & Priority Requests |

---

## ⚡ Step 5: Start the MediBridge Application

```bash
# Start Backend API Server (Port 5000)
cd backend
npm run dev

# Start Frontend React Web Application (Port 5173)
cd frontend
npm run dev

# (Optional) Start Python ML Demand Forecasting Service (Port 8000)
cd ml-service
python -m uvicorn app.main:app --port 8000 --reload
```

Open your browser at `http://localhost:5173` to experience the complete platform!
