# Contributing to CrackMode

First off — thank you for taking the time to contribute! CrackMode is built by the community, for the community. Whether you're fixing a bug, improving docs, or building a new feature, your contribution matters.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Project Structure](#project-structure)
- [Getting Help](#getting-help)

---

## Code of Conduct

By participating in this project, you agree to keep interactions respectful and constructive. We are a community of engineers helping each other grow — treat everyone accordingly.

---

## Getting Started

### 1. Fork the repository

Click the **Fork** button at the top right of the [CrackMode repo](https://github.com/Morgan-Ngetich/crackmode) to create your own copy.

### 2. Clone your fork

```bash
git clone git@github.com:YOUR_USERNAME/crackmode.git
cd crackmode
```

### 3. Add the upstream remote

```bash
git remote add upstream git@github.com:Morgan-Ngetich/crackmode.git
```

### 4. Set up the project

Follow the setup instructions in the relevant README:

- [Main README](./README.md) — full stack Docker setup
- [Frontend README](./frontend/README.md) — local frontend dev with hot reload
- [Backend README](./backend/README.md) — migrations and dependency management

### 5. Create a branch

Never work directly on `main`. Always branch off from the latest `main`:

```bash
git checkout main
git pull upstream main
git checkout -b your-branch-name
```

---

## How to Contribute

### Good first contributions

- Fix typos or improve documentation
- Improve existing UI components
- Add missing test coverage
- Fix a bug from the [Issues](https://github.com/Morgan-Ngetich/crackmode/issues) tab

### Larger contributions

For significant changes — new features, architectural changes, or anything that touches core logic — please **open an issue first** to discuss the approach before writing code. This avoids wasted effort if the direction doesn't align with the project roadmap.

---

## Branch Naming

Use clear, consistent branch names:

| Type | Format | Example |
|------|--------|---------|
| Feature | `feat/short-description` | `feat/leaderboard-pagination` |
| Bug fix | `fix/short-description` | `fix/auth-redirect-loop` |
| Documentation | `docs/short-description` | `docs/update-backend-readme` |
| Refactor | `refactor/short-description` | `refactor/api-service-layer` |

---

## Commit Messages

Write clear, descriptive commit messages. Follow this format:

```
type: short description

Optional longer explanation if needed.
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Examples:**

```bash
feat: add pagination to leaderboard endpoint
fix: resolve Supabase session expiry on refresh
docs: update backend README with Poetry workflow
refactor: extract matching logic into service layer
```

---

## Pull Request Process

1. **Sync with upstream** before opening a PR:

```bash
git fetch upstream
git rebase upstream/main
```

2. **Push your branch** to your fork:

```bash
git push origin your-branch-name
```

3. **Open a Pull Request** against the `main` branch of the CrackMode repo.

4. **Fill in the PR template** — describe what changed, why, and how to test it.

5. **Wait for review** — a maintainer will review your PR. Be responsive to feedback.

6. Once approved, your PR will be merged. 🎉

### PR Checklist

Before submitting, make sure:

- [ ] Code runs locally without errors
- [ ] Backend migrations are included if models changed
- [ ] No `.env` files or secrets are committed
- [ ] `poetry.lock` is committed if dependencies were added
- [ ] Documentation is updated if behaviour changed

---

## Reporting Bugs

Found a bug? [Open an issue](https://github.com/Morgan-Ngetich/crackmode/issues/new) and include:

- A clear title and description
- Steps to reproduce the bug
- Expected vs actual behaviour
- Screenshots if relevant
- Your environment (OS, Node version, browser)

---

## Suggesting Features

Have an idea? [Open an issue](https://github.com/Morgan-Ngetich/crackmode/issues/new) with the label `enhancement` and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered

---

## Project Structure

```
crackmode/
├── frontend/          — React Vite app (TypeScript, TanStack, Chakra UI)
│   ├── src/
│   └── server.js      — SSR server
└── backend/           — FastAPI app (PostgreSQL, Supabase, Docker)
    ├── app/
    └── alembic/       — Database migrations
```

---

## Getting Help

- Browse existing [Issues](https://github.com/Morgan-Ngetich/crackmode/issues) and [Pull Requests](https://github.com/Morgan-Ngetich/crackmode/pulls)
- Join the CrackMode community at [CrackMode](https://crackmode.vercel.app)
- Reach out to the maintainer: [ngetichmorgan6@gmail.com](mailto:ngetichmorgan6@gmail.com)

---

*Built with ❤️ by the CrackMode community.*
