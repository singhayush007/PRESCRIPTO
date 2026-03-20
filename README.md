# 🏥 Prescripto — Full Stack Doctor Appointment Booking System

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/singhayush007/PRESCRIPTO?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/singhayush007/PRESCRIPTO?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/singhayush007/PRESCRIPTO?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Made with MERN](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square&logo=react&logoColor=black)

**A production-ready full-stack MERN application for seamless doctor appointment booking.**

[🌐 Live Demo](https://prescriptofullstack.vercel.app) · [🐛 Report Bug](https://github.com/singhayush007/PRESCRIPTO/issues) · [✨ Request Feature](https://github.com/singhayush007/PRESCRIPTO/issues)

</div>

---

![Prescripto Screenshot](./frontend/src/assets/prescripto.png)

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#️-folder-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About

**Prescripto** is a full-stack MERN application with **three-level authentication** — Patient, Doctor, and Admin.

- **Patients** can register, browse doctors by speciality, book appointments, and pay online.
- **Doctors** can manage their appointments, update their profile, and track earnings.
- **Admins** can add/remove doctors, oversee all appointments, and manage the platform.

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 🔐 **Role-Based Auth** | Separate login and dashboards for Patients, Doctors, and Admins using JWT |
| 📅 **Appointment Booking** | Patients can book, reschedule, and cancel appointments |
| 💳 **Online Payments** | Integrated **Razorpay** and **Stripe** payment gateways |
| 👨‍⚕️ **Doctor Dashboard** | Doctors can manage appointments, update availability, and view earnings |
| 🛠️ **Admin Dashboard** | Full control over doctors, patients, and appointments |
| ☁️ **Image Uploads** | Profile and document uploads via **Cloudinary** |
| 💻 **Responsive UI** | Clean, mobile-friendly UI built with **React.js** and **Tailwind CSS** |
| 🔒 **Secure Backend** | Password hashing with **Bcrypt**, input validation, and CORS protection |
| 🌐 **Deployment Ready** | Configured for deployment on **Vercel**, **Railway**, or **Heroku** |

---

## 💻 Tech Stack

### Frontend (Patient + Doctor)
![React.js](https://img.shields.io/badge/React.js-61DAFB?style=flat&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
![React Toastify](https://img.shields.io/badge/React_Toastify-FF69B4?style=flat)

### Admin Panel
![React.js](https://img.shields.io/badge/React.js-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-3385FF?style=flat)
![Cloudinary](https://img.shields.io/badge/Cloudinary-2B73B6?style=flat)
![Multer](https://img.shields.io/badge/Multer-EE6C4D?style=flat)
![Razorpay](https://img.shields.io/badge/Razorpay-008CFF?style=flat)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=flat)

---

## 🗂️ Folder Structure

```
prescripto-full-stack/
│
├── admin/                   # Admin panel (React + Vite + Tailwind)
│   ├── src/
│   ├── public/
│   ├── .env                 # Local env (not committed)
│   ├── .env.example         # Env template
│   └── package.json
│
├── backend/                 # Node.js + Express REST API
│   ├── config/              # Database connection
│   ├── controllers/         # Route controllers
│   ├── middleware/           # Auth & upload middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── .env                 # Local env (not committed)
│   ├── .env.example         # Env template
│   └── server.js
│
├── frontend/                # Patient & Doctor frontend (React + Vite + Tailwind)
│   ├── src/
│   ├── public/
│   ├── .env                 # Local env (not committed)
│   ├── .env.example         # Env template
│   └── package.json
│
└── README.md
```

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Cloudinary](https://cloudinary.com/) account
- [Razorpay](https://razorpay.com/) or [Stripe](https://stripe.com/) account (for payments)

### 1. Clone the repository

```bash
git clone https://github.com/singhayush007/PRESCRIPTO.git
cd PRESCRIPTO
```

### 2. Install dependencies

Each part of the app has its own `package.json`. Install dependencies separately:

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Admin
cd ../admin && npm install
```

---

## 🔐 Environment Variables

Each package has a `.env.example` file. Copy it to `.env` and fill in your values.

### Backend (`backend/.env`)

```bash
cp backend/.env.example backend/.env
```

| Variable | Description |
| --- | --- |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |

### Frontend (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Backend API base URL (e.g. `http://localhost:4000`) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key ID (public) |

### Admin (`admin/.env`)

```bash
cp admin/.env.example admin/.env
```

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Backend API base URL (e.g. `http://localhost:4000`) |
| `VITE_CURRENCY` | Currency symbol (e.g. `$` or `₹`) |

---

## ▶️ Running the App

Open **three separate terminals** and run:

```bash
# Terminal 1 — Backend (runs on http://localhost:4000)
cd backend
npm run server
```

```bash
# Terminal 2 — Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

```bash
# Terminal 3 — Admin Panel (runs on http://localhost:5174)
cd admin
npm run dev
```

---

## ☁️ Deployment

This project is deployed on **Vercel**. You can also deploy on **Railway**, **Render**, or **Heroku**.

| Service | Recommended For |
| --- | --- |
| [Vercel](https://vercel.com) | Frontend & Admin |
| [Railway](https://railway.app) | Backend |
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Database |
| [Cloudinary](https://cloudinary.com) | Media storage |

> Make sure to set all environment variables in your hosting platform's dashboard before deploying.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'add: your feature description'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/singhayush007">Ayush Singh</a>
</div>
