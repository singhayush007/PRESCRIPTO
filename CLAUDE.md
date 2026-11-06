# Project conventions

## Naming

- A component or hook file is named after the main thing it exports, in PascalCase (`DoctorCard.jsx`, `useSaved.js`, `HomeView.jsx`).
- Other files use a role suffix: `*.service.js`, `*.utils.js`, `*.constants.js`, `*.model.js`, `*.controller.js`, `*.routes.js`.

## Frontend and admin structure (`frontend/src`, `admin/src`)

```
app/          app shell: App.jsx (routes, providers)
components/   layout/ (navbar, footer, nav...)  common/ (generic UI used by many features)
features/     <feature>/{components,hooks,services,constants,utils,views}
shared/       api/ (the axios instance), hooks/, utils/, constants/ used by several features
store/        React contexts (global state)
assets/       static images
```

- A **view** is a page (`views/HomeView.jsx`). It composes the feature's components and hooks.
- Features do not import from each other's `components/`. Shared code goes to `components/common` or `shared/`.
- **API calls live in `services/`** and use `shared/api/http.js`. Components never import axios.
- Use the `@/` alias (`@/features/doctors/hooks/useSaved`) instead of long relative paths.

## Backend structure (`backend/`)

```
api/server.js   entry point (also the Vercel serverless entry)
app.js          Express app (middleware + routes), imported by the tests
config/         env validation, MongoDB, Cloudinary
features/       <feature>/{*.model.js, *.controller.js, *.routes.js, *.service.js}
shared/         middleware/ (auth guards, upload), utils/ (logger, http helpers, validators)
tests/          integration tests (in-memory MongoDB)
```

- Controllers answer business errors with HTTP 200 `{ success: false, message }`; auth problems use 401, rate limiting 429.
- Use `logger` (never `console.*`) and the helpers in `shared/utils/http.js`.

## Workflow

- Never push to `main` directly: open a Pull Request (a git hook enforces it, see `.githooks/README.md`).
- Commit messages are short plain sentences in the imperative: "Add reschedule endpoint for patients."
- Before pushing: `npm run lint`, `npm test`, `npm run build`, `npm run format:check`.
- Never commit `.env` files or any real secret.
