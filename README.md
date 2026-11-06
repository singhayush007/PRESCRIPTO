# 🏥 Prescripto — Full Stack Doctor Appointment Booking System

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/singhayush007/PRESCRIPTO?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/singhayush007/PRESCRIPTO?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/singhayush007/PRESCRIPTO?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Made with MERN](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square&logo=react&logoColor=black)

**A full-stack MERN application for booking doctor appointments — with patient, doctor and admin experiences.**

[🌐 Live Demo](https://prescriptofullstack.vercel.app) · [🐛 Report Bug](https://github.com/singhayush007/PRESCRIPTO/issues) · [✨ Request Feature](https://github.com/singhayush007/PRESCRIPTO/issues)

</div>

---

## 📋 Table of Contents

- [Screenshots](#-screenshots)
- [About](#-about)
- [Features](#-features)
- [Engineering Highlights](#-engineering-highlights)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#️-folder-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)
- [Testing & Quality](#-testing--quality)
- [API Overview](#-api-overview)
- [Deployment](#-deployment)
- [Security Notes](#-security-notes)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📸 Screenshots

### Home page (desktop)

![Prescripto home page — desktop view](docs/screenshots/home-desktop.png)

---

## 📖 About

**Prescripto** is a full-stack MERN application with **three roles** — Patient, Doctor and Admin.

- **Patients** sign up, search and filter doctors, book / reschedule / cancel appointments, pay online, and rate their doctor after a completed visit.
- **Doctors** log in to their workspace to manage appointments (complete or cancel), see earnings and a 7-day bookings chart, and edit their profile and availability.
- **Admins** add doctors, toggle their availability, oversee every appointment and track platform analytics (patients, bookings, revenue).

The project has three apps: the patient **frontend**, an **admin panel** (used by admins *and* doctors), and the **backend** REST API.

---

## ✨ Features

### Patient app
| Feature | Description |
| --- | --- |
| 🔐 **Auth** | Sign up / login with JWT, password-strength meter, and return-to-page after login |
| 🏠 **Personal dashboard** | After login: greeting, next appointment (Today / Tomorrow…), upcoming & completed counts, quick actions |
| 🔎 **Search, sort & filter** | Search by name or speciality, sort by rating, fees or experience, "available now" filter, speciality category bar |
| ♥ **Saved doctors** | Save doctors with a heart and filter by "Saved" |
| ⌘K **Quick search** | Press `⌘K` / `Ctrl+K` anywhere to jump to a doctor or page |
| 📅 **Booking** | Day → time → confirm flow with a progress indicator; booked slots disappear instantly |
| ✅ **Booking confirmation** | Success screen with appointment details and **Add to calendar** (`.ics` for Google / Apple / Outlook) |
| 🔁 **Reschedule & cancel** | Move a visit to another free slot or cancel it; slots are released automatically |
| 💳 **Online payments** | **Stripe** and **Razorpay** checkout, verified server-side |
| ⭐ **Ratings & reviews** | Only patients with a *completed* visit can review (one review per visit); averages shown on cards and doctor pages |
| 👋 **Onboarding** | First-visit welcome slides (skippable, shown once) |
| 🌗 **Dark mode** | Light / dark theme that follows the system preference and remembers your choice |
| 📱 **Responsive** | Mobile-first layout with a native-style bottom tab bar |
| 🧭 **Routing polish** | Protected routes, 404 page, per-page titles, loading skeletons, empty states |

### Admin panel (Admin + Doctor)
| Feature | Description |
| --- | --- |
| 📊 **Dashboards** | Stat cards, 7-day bookings bar chart, appointment-status donut, latest bookings |
| 🗓️ **Appointments** | Status tabs (Upcoming / Completed / Cancelled), search, cancel with a confirmation dialog |
| 👨‍⚕️ **Doctors management** | Add doctors (photo preview, validation), search / filter, availability toggle |
| 🩺 **Doctor workspace** | Complete or cancel visits, earnings, edit bio / fees / address / availability |
| 🌗 **Dark mode & mobile nav** | Same design system as the patient app |
| 🛡️ **Role guards** | A doctor can't open admin pages (and vice versa); expired sessions return to login |

### Platform
| Feature | Description |
| --- | --- |
| ☁️ **Image uploads** | Doctor and profile images via **Cloudinary** (JPG / PNG / WEBP, max 2 MB) |
| 🔒 **Secure backend** | Bcrypt hashing, expiring JWTs, Helmet headers, rate limiting, NoSQL-injection-safe inputs, configurable CORS |
| 🤖 **CI** | GitHub Actions lints and builds the frontend and admin panel and syntax-checks the API on every PR |

---

## 🧠 Engineering Highlights

- **Race-condition-free booking & rescheduling** — a slot is claimed with one atomic MongoDB update (`$ne` + `$push`); 10 simultaneous requests for one slot produce exactly one booking. A **partial unique index** on active appointments makes the database refuse duplicates even if application code is bypassed, and a failed reschedule never loses the original slot.
- **Server-side payment verification** — Stripe sessions and Razorpay orders are verified with the gateway and matched to the logged-in user, so a client cannot mark an appointment as paid.
- **Hardened auth & API** — expiring JWTs, role-claim admin tokens, no account enumeration, rate-limited login/register, Helmet, strict CORS option, `trust proxy` support so limits use real client IPs, and clean JSON errors for bad bodies and uploads.
- **Production operations** — validated config (fails fast with a clear message), structured JSON logs (pino) with a request id on every response, `/health` and `/ready` endpoints, graceful shutdown, cached DB connection for serverless.
- **Tested** — 44 backend integration tests (real Express app + in-memory MongoDB, hermetic) plus frontend/admin unit tests, all run in CI together with lint, build, format check and a dependency audit gate.
- **Feature-first architecture** — `features/<name>/{components,hooks,services,views,...}` + `shared/` in both React apps, an API **services layer** (components never call axios), and domain modules in the backend. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- **Fast & resilient UI** — route-level code splitting, optimized WebP images (bundle ~4 MB → ~0.6 MB), error boundaries, loading skeletons, SEO/Open Graph tags, skip link and `prefers-reduced-motion` support.
- **Denormalized ratings & efficient analytics** — averages are recomputed with an aggregation on each review; dashboards use counts and aggregations instead of loading whole collections.
- **Shared design system** — both apps use the same Tailwind tokens (CSS variables), so dark mode is a one-class switch.

---

## 💻 Tech Stack

### Frontend (Patient) & Admin Panel
![React.js](https://img.shields.io/badge/React.js-61DAFB?style=flat&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
![React Toastify](https://img.shields.io/badge/React_Toastify-FF69B4?style=flat)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-3385FF?style=flat)
![Helmet](https://img.shields.io/badge/Helmet-333333?style=flat)
![Rate Limit](https://img.shields.io/badge/express--rate--limit-0A66C2?style=flat)
![Cloudinary](https://img.shields.io/badge/Cloudinary-2B73B6?style=flat)
![Multer](https://img.shields.io/badge/Multer-EE6C4D?style=flat)
![Razorpay](https://img.shields.io/badge/Razorpay-008CFF?style=flat)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat)
![Pino](https://img.shields.io/badge/Pino-687634?style=flat)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=flat)

### Quality
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)
![Node test runner](https://img.shields.io/badge/node:test-339933?style=flat&logo=node.js&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=githubactions&logoColor=white)

---

## 🗂️ Folder Structure

```
PRESCRIPTO/
├── backend/                     # Express REST API
│   ├── api/server.js            # entry point (also the Vercel serverless entry)
│   ├── app.js                   # Express app: middleware + routes (imported by tests)
│   ├── config/                  # env validation, MongoDB, Cloudinary
│   ├── features/                # one folder per domain
│   │   ├── users/               # user.model / controller / routes (auth, profile)
│   │   ├── doctors/             # doctor.model / controller / routes
│   │   ├── appointments/        # booking, cancel, reschedule (+ appointment.service)
│   │   ├── payments/            # Stripe + Razorpay
│   │   ├── reviews/             # ratings & reviews
│   │   └── admin/               # admin controller + routes
│   ├── shared/                  # middleware/ (auth guards, upload), utils/ (logger, http, helpers)
│   └── tests/                   # integration tests (in-memory MongoDB)
│
├── frontend/                    # Patient app (React + Vite + Tailwind)
│   └── src/
│       ├── app/                 # App.jsx (routes, lazy pages)
│       ├── components/          # layout/ (navbar, footer, tab bar)  common/ (modal, error boundary...)
│       ├── features/            # home, doctors, booking, my-appointments, payments,
│       │                        # auth, profile, search, onboarding, about, contact, not-found
│       │   └── <feature>/{components,hooks,services,constants,views}
│       ├── shared/              # api/http.js (axios), hooks/, utils/, constants/
│       ├── store/               # AppContext (global state)
│       └── assets/
│
├── admin/                       # Admin + Doctor panel (same layout as the patient app)
│   └── src/{app,components,features,shared,store,assets}
│
├── docs/                        # ARCHITECTURE.md, ENV_REFERENCE.md, screenshots/
├── .githooks/                   # pre-push hook: no direct pushes to main
├── .github/                     # CI, Dependabot, PR template
├── CLAUDE.md                    # naming + structure conventions
└── package.json                 # root scripts (lint, test, build, format)
```

Conventions (naming, `@/` import alias, services layer) are documented in [CLAUDE.md](CLAUDE.md).

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ (v22 recommended, see `.nvmrc`)
- [npm](https://www.npmjs.com/) v9+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB)
- [Cloudinary](https://cloudinary.com/) account (image uploads)
- [Stripe](https://stripe.com/) and / or [Razorpay](https://razorpay.com/) account (payments — the app still runs without them; the pay buttons just report that the gateway isn't configured)

### 1. Clone the repository

```bash
git clone https://github.com/singhayush007/PRESCRIPTO.git
cd PRESCRIPTO
```

### 2. Install dependencies

```bash
npm run install:all      # installs backend, frontend and admin (and sets up the git hooks)
```

### 3. Configure environment variables

See [Environment Variables](#-environment-variables). **Never commit your `.env` files.**

### 4. Create your first doctor

1. Start the apps (see [Running the App](#-running-the-app)) and log in to the **admin panel** with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env`.
2. Open **Add doctor** and create one or more doctors.
3. Doctors can then log in from the **Doctor** tab of the same panel; patients sign up on the patient app.

---

## 🔐 Environment Variables

Each package has a `.env.example`. Copy it to `.env` and fill in your values. The full reference is in [docs/ENV_REFERENCE.md](docs/ENV_REFERENCE.md).

### Backend (`backend/.env`)

```bash
cp backend/.env.example backend/.env
```

| Variable | Required | Description |
| --- | --- | --- |
| `JWT_SECRET` | ✅ | Secret for signing JWTs (use a long random string) |
| `ADMIN_EMAIL` | ✅ | Admin login email |
| `ADMIN_PASSWORD` | ✅ | Admin login password |
| `MONGODB_URI` | ✅ | MongoDB connection string **without** a database name (the app uses `/prescripto`) |
| `CURRENCY` | | Payment currency code, e.g. `USD` or `INR` |
| `CLOUDINARY_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_SECRET_KEY` | | Needed for image uploads |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | | Razorpay payments |
| `STRIPE_SECRET_KEY` | | Stripe payments |
| `CORS_ORIGINS` | | Comma-separated allowed origins, e.g. `https://app.vercel.app,https://admin.vercel.app` (empty = allow all, dev only) |
| `FRONTEND_URL` | | Patient-app URL used for Stripe return links |
| `RATE_LIMIT_MAX` | | Requests per 15 min per IP (default `300`) |
| `AUTH_RATE_LIMIT_MAX` | | Login / register attempts per 15 min per IP (default `20`) |
| `TRUST_PROXY` | | Reverse proxies in front of the API (default `1` in production) |
| `LOG_LEVEL` | | `info` (default), `debug`, `warn`, ... |

The server refuses to start if `JWT_SECRET`, `MONGODB_URI`, `ADMIN_EMAIL` or `ADMIN_PASSWORD` is missing.

### Frontend (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Backend API base URL (e.g. `http://localhost:4000`) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key ID (public key) |

### Admin (`admin/.env`)

```bash
cp admin/.env.example admin/.env
```

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Backend API base URL (e.g. `http://localhost:4000`) |
| `VITE_CURRENCY` | Currency symbol shown in the panel (e.g. `$` or `₹`) |

---

## ▶️ Running the App

Install everything once, then start the three apps (three terminals):

```bash
npm run install:all      # backend + frontend + admin

npm run dev:backend      # API            -> http://localhost:4000   (health: /health, readiness: /ready)
npm run dev:frontend     # Patient app    -> http://localhost:5173
npm run dev:admin        # Admin / Doctor -> http://localhost:5174
```

Production API: `cd backend && npm start`.

---

## 🧪 Testing & Quality

```bash
npm test                 # backend integration tests + frontend/admin unit tests
npm run lint             # ESLint in all three apps
npm run build            # production builds of both React apps
npm run format:check     # Prettier  (npm run format to fix)
```

- Backend tests start the real Express app against an **in-memory MongoDB** (no database, Stripe or Cloudinary needed) and cover auth, concurrent booking, rescheduling, reviews, dashboards, admin uploads, rate limiting and security headers.
- CI (GitHub Actions) runs all of the above plus `npm audit` (production dependencies, high severity) on every pull request.
- A git hook blocks direct pushes to `main`; work goes through Pull Requests (see [CONTRIBUTING.md](CONTRIBUTING.md)).

---

## 🔌 API Overview

All endpoints are under `/api`. Authenticated routes expect the JWT in a header: `token` (patient), `dtoken` (doctor) or `atoken` (admin).

| Area | Endpoints |
| --- | --- |
| **Patient** `/api/user` | `POST /register` · `POST /login` · `GET /get-profile` · `POST /update-profile` · `POST /book-appointment` · `GET /appointments` · `POST /cancel-appointment` · `POST /reschedule-appointment` · `POST /add-review` · `POST /payment-stripe` · `POST /verifyStripe` · `POST /payment-razorpay` · `POST /verifyRazorpay` |
| **Doctor** `/api/doctor` | `POST /login` · `GET /list` *(public)* · `GET /reviews/:docId` *(public)* · `GET /appointments` · `POST /complete-appointment` · `POST /cancel-appointment` · `POST /change-availability` · `GET /profile` · `POST /update-profile` · `GET /dashboard` |
| **Admin** `/api/admin` | `POST /login` · `POST /add-doctor` · `GET /all-doctors` · `POST /change-availability` · `GET /appointments` · `POST /cancel-appointment` · `GET /dashboard` |
| **System** | `GET /health` (liveness) · `GET /ready` (database connected) |

Responses use the shape `{ success: boolean, message?: string, ...data }`.

---

## ☁️ Deployment

The three apps deploy independently — the live demo runs on **Vercel**.

| Service | Recommended For |
| --- | --- |
| [Vercel](https://vercel.com) | Frontend, Admin panel and (via `backend/vercel.json`) the API |
| [Railway](https://railway.app) / [Render](https://render.com) | Alternative hosts for the API |
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Database |
| [Cloudinary](https://cloudinary.com) | Media storage |

- Set every environment variable in your host's dashboard, and set `CORS_ORIGINS` to your deployed frontend and admin URLs.
- Rate limiting is in-memory per server instance; for strict global limits on serverless, back it with a shared store (e.g. Redis).

---

## 🛡️ Security Notes

See [SECURITY.md](SECURITY.md) for how to report a vulnerability.

- `.env` files are git-ignored. If a secret was ever committed, **rotate it** (database password, Cloudinary, Stripe / Razorpay keys, `JWT_SECRET`, admin password) — removing the file from the latest commit does not remove it from git history.
- Use a strong, unique `JWT_SECRET` and admin password in production.

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and workflow.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'add: your feature description'`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request — CI will lint and build the apps

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/singhayush007">Ayush Singh</a>
</div>
