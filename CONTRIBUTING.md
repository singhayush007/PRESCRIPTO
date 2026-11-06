# Contributing

Thanks for helping improve Prescripto!

## Setup

```bash
npm run install:all          # installs backend, frontend and admin
cp backend/.env.example backend/.env   # then fill it in (see docs/ENV_REFERENCE.md)
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
npm run dev:backend          # API        http://localhost:4000
npm run dev:frontend         # patient    http://localhost:5173
npm run dev:admin            # admin      http://localhost:5174
```

## Workflow

1. Branch from `main`: `git checkout -b feature/short-description`.
2. Follow the conventions in [CLAUDE.md](CLAUDE.md) (structure, naming, services layer).
3. Add or update tests for behaviour changes.
4. Run `npm run lint && npm test && npm run build && npm run format:check`.
5. Commit with short imperative sentences ("Add reschedule endpoint.") and open a Pull Request to `main`.
   Direct pushes to `main` are blocked by a git hook.

## Tests

- `npm test` runs the backend integration tests (in-memory MongoDB; no real services needed) and the frontend / admin unit tests.
