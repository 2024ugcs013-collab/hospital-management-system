# Hospital Management System

A role-based hospital portal for patients, doctors, and administrators.

## Features

- Patients can register, filter approved doctors by specialty, and submit appointment requests.
- Doctors register with degree and licence documents, then accept or reject patient requests after admin approval.
- Admins review doctor applications and approve/reject verification; admin user-management endpoints are also available.

## Technology

- Frontend: React 18, Vite, React Router, Tailwind CSS, Axios, React Hook Form.
- Backend: Node.js, Express, MongoDB/Mongoose, JWT authentication, bcrypt password hashing, Multer/Cloudinary document uploads.

## Run locally

1. Set `MONGODB_URI` and `JWT_SECRET` in `backend/.env` (Cloudinary credentials are optional for document storage).
2. Run `npm install` at the repository root.
3. Start the UI with `npm run dev` and the API with `npm run dev --workspace backend`.
4. Create a production frontend build with `npm run build`.

The API is mounted at `/api`; its health endpoint is `/health`.

## Admin approval (local demo)

Restart the backend after connecting MongoDB. It creates the local demo admin automatically; then log in at `/login` with
`@dmin@hospital.loc@l` / `password1`. Open **Doctor verification** from the
admin dashboard and approve a pending doctor application. Only approved doctors
appear in patient search and can receive appointment requests. Change this demo
password before deployment.
