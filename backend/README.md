# Dorm Management Backend (Express)

This is a minimal scaffold for the dormitory management backend (Express + MariaDB).

Quick start

1. Copy `.env.example` to `.env` and populate database connection values.
2. From the `backend` folder run:

```
npm install
npm run dev
```

3. The server exposes a simple API under `/api`. Example endpoints:
- GET /api/buildings
- GET /api/buildings/:id
- POST /api/buildings

Next steps
- Add routes/controllers/models for rooms, students, staff, registrations, payments, notifications, support requests.
- Add validation, authentication, and migrations.
