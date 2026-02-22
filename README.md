# CrackMode

> Master Coding Interviews. Level Up. Compete.

A full-stack technical interview prep platform with a competitive real-time leaderboard, MDX-powered documentation, and a growing community of 600+ engineers.

---

## Project Structure

```
crackmode/
├── frontend/   — React Vite app (TypeScript, TanStack, Chakra UI)
└── backend/    — FastAPI app (PostgreSQL, Supabase, Docker)
```

- `frontend/` — [Frontend README](./frontend/README.md)
- `backend/` — [Backend README](./backend/README.md)

---

## Quickstart

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed

### Run the full stack

```bash
# 1. Clone the repo
git clone git@github.com:Morgan-Ngetich/crackmode.git
cd crackmode

# 2. Copy environment files
cp .env.example .env

# 3. Build and start all services
docker compose build
docker compose up -d
```

The application will be available at **http://localhost**.

> **Note:** You will need Supabase credentials to run the app. Contact the maintainer or check the [Contributing Guide](./CONTRIBUTING.md) for onboarding details.

---

## Development

For local frontend development with hot reload, see the [Frontend README](./frontend/README.md).

For backend development including migrations and dependency management, see the [Backend README](./backend/README.md).

---

## Contributing

CrackMode is open source and contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) before submitting a pull request.

---

## License

[MIT](https://github.com/Morgan-Ngetich/crackmode/blob/main/LICENSE)
