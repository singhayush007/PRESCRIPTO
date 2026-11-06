# Security policy

## Reporting a vulnerability

Please do **not** open a public issue for security problems. Report them privately through
[GitHub Security Advisories](https://github.com/singhayush007/PRESCRIPTO/security/advisories/new)
or by emailing the maintainer, and include steps to reproduce. You will get a reply as soon as possible.

## Handling secrets

- `.env` files are git-ignored and must never be committed.
- If a secret is ever committed, **rotate it** (database password, Cloudinary, Stripe / Razorpay keys, `JWT_SECRET`, admin password). Deleting the file in a later commit does not remove it from git history.
