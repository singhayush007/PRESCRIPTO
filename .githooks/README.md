# Git hooks

Versioned git hooks, kept here (instead of `.git/hooks`) so everyone gets the same checks.

## Setup

Wired up automatically by the root `prepare` script when you run `npm install` in the repo root.
Manually:

```sh
git config core.hooksPath .githooks
```

## Hooks

### `pre-push`

Blocks direct pushes to `main`. Changes land on it through a Pull Request only.
To protect more branches, edit `PROTECTED_BRANCHES` at the top of the hook.

## Emergency override

Client-side hooks are advisory (`git push --no-verify` bypasses them). If you really must push directly:

```sh
ALLOW_PROTECTED_PUSH=1 git push origin main
```

For a hard guarantee, also enable branch protection on GitHub (Settings -> Branches) and require a PR before merging.
