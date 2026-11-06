# Architecture

Three independent apps in one repository:

```
frontend/  patient app (React + Vite)        -> calls the API
admin/     admin + doctor panel (React+Vite) -> calls the API
backend/   REST API (Express + MongoDB)
```

## Request flow

1. A view (page) uses a hook or a **service** from its feature.
2. The service calls the shared axios instance (`shared/api/http.js`), which adds the JWT header and handles 401 / 429 in one place.
3. The API (`backend/app.js`) applies Helmet, CORS, compression, rate limits and request logging, then routes to a feature:
   `routes -> auth guard (shared/middleware) -> controller -> model`.
4. Controllers answer `{ success, message, ...data }`.

## Roles and tokens

| Role | Header | Created by |
| --- | --- | --- |
| Patient | `token` | sign up on the patient app |
| Doctor | `dtoken` | admin adds the doctor |
| Admin | `atoken` | credentials from the environment |

Tokens are JWTs that expire (patients and doctors 7 days, admin 1 day). Admin tokens carry a `role` claim.

## Booking integrity

- Doctors keep `slots_booked: { "<d>_<m>_<yyyy>": ["10:00 AM", ...] }`.
- A slot is claimed with **one atomic update** (`$ne` + `$push`), so concurrent requests cannot take the same slot.
- A partial unique index on active appointments (`docId + slotDate + slotTime`) makes the database refuse duplicates even if application code is bypassed.
- Cancelling or rescheduling releases the old slot; a failed reschedule never loses the original slot.

## Payments

Stripe sessions and Razorpay orders are verified **with the gateway** and matched to the logged-in patient; the browser's "success" flag is never trusted.

## Observability

Structured JSON logs (pino) with a request id (`x-request-id` header), `GET /health` (liveness) and `GET /ready` (database connected).

## Testing

- `backend/tests`: integration tests against the real Express app and an in-memory MongoDB (auth, booking races, reschedule, reviews, dashboards, admin uploads, security).
- `frontend` and `admin`: Vitest unit tests for the date/slot and chart helpers.
