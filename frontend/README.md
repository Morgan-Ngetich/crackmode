# Frontend

Built with **React + Vite + TypeScript + Chakra UI + TanStack (Query, Router, Start)**.

Features server-side rendering (SSR) via a custom `server.js` configuration, deployed on Vercel in production.

---

## Project Structure

```
frontend/
├── src/           — Application source code
├── docker/        — NGINX and startup configs
├── server.js      — Custom SSR server
├── Dockerfile
├── .env.example
└── package.json
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22+ |
| npm | 9+ |
| Docker | 20+ (for containerized setup) |

---

## Quickstart (Docker)

Recommended for running the full stack locally.

```bash
# From the project root
docker compose build
docker compose up -d
```

| URL | Description |
|-----|-------------|
| http://localhost | Application |
| http://localhost/docs | Swagger API Docs |

---

## Local Development (Hot Reload)

Run the frontend locally while the backend runs in Docker.

```bash
# 1. Ensure the backend is running
docker compose up -d

# 2. Navigate to the frontend directory
cd crackmode/frontend

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# 5. Start the dev server
npm run dev
```

Access the app at **http://localhost:5174**

---

## Environment Variables

```bash
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=/api/v1
```

> Never commit your `.env` file. It is already in `.gitignore`.

---

## Common Docker Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start all services in the background |
| `docker compose build` | Rebuild containers after Dockerfile changes |
| `docker compose restart` | Restart containers |
| `docker compose logs -f` | Stream container logs |
| `docker compose down -v` | Stop and remove containers |

---

## Deployment

The frontend is deployed on **Vercel**. The SSR setup uses a custom `server.js` to handle server-side rendering in production. Any push to the `main` branch triggers an automatic deployment via the Vercel CI/CD pipeline.

---

## Notes

- The backend must be running for API calls to work. Start it with `docker compose up -d` before running the frontend locally.
- This app uses **Supabase** for authentication. Ensure your Supabase project has email/password auth enabled.
- Never commit your `.env` file.

---

## License

[MIT](https://github.com/Morgan-Ngetich/crackmode/blob/main/LICENSE)
