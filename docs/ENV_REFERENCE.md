# Environment reference

Copy each `.env.example` to `.env` and fill it in. **Never commit real values.**

## Backend (`backend/.env`)

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `JWT_SECRET` | yes | - | Secret used to sign login tokens. Use a long random string. |
| `MONGODB_URI` | yes | - | MongoDB connection string **without** a database name (the app appends `/prescripto`). |
| `ADMIN_EMAIL` | yes | - | Admin login email. |
| `ADMIN_PASSWORD` | yes | - | Admin login password. |
| `PORT` | no | `4000` | Port for a long-running server (ignored on Vercel). |
| `NODE_ENV` | no | `development` | `production` switches on JSON logs and the production proxy default. |
| `LOG_LEVEL` | no | `info` | `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent`. |
| `CORS_ORIGINS` | no (set it in production) | allow all | Comma-separated browser origins allowed to call the API. |
| `TRUST_PROXY` | no | `1` in production, `0` otherwise | Number of reverse proxies in front of the API. Needed for correct client IPs (rate limiting). |
| `RATE_LIMIT_MAX` | no | `300` | Requests per 15 minutes per IP. |
| `AUTH_RATE_LIMIT_MAX` | no | `20` | Login / register attempts per 15 minutes per IP. |
| `CURRENCY` | no | `USD` (Stripe), `INR` (Razorpay) | Payment currency code. |
| `FRONTEND_URL` | no | request `Origin` | Patient-app URL used for Stripe return links. |
| `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY` | for image uploads | - | Cloudinary credentials. |
| `STRIPE_SECRET_KEY` | for Stripe | - | Without it Stripe payments answer "not configured". |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | for Razorpay | - | Without them Razorpay payments answer "not configured". |

## Patient app (`frontend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_BACKEND_URL` | yes | Backend base URL, e.g. `http://localhost:4000`. |
| `VITE_RAZORPAY_KEY_ID` | for Razorpay | Razorpay **public** key id. |

## Admin panel (`admin/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_BACKEND_URL` | yes | Backend base URL. |
| `VITE_CURRENCY` | no (default `$`) | Currency symbol shown in the panel. |

`VITE_*` values are embedded in the browser bundle: never put secrets in them.
