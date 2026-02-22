# Backend

Built with **FastAPI + PostgreSQL + Supabase**, fully containerized with Docker and deployed on Railway.

---

## Project Structure

```
backend/
├── app/
│   ├── api/           — Route handlers
│   ├── models/        — SQLAlchemy models
│   ├── schemas/       — Pydantic schemas
│   ├── services/      — Business logic
│   └── main.py        — FastAPI entrypoint
├── alembic/           — Database migrations
├── alembic.ini
├── pyproject.toml     — Poetry dependency management
├── Dockerfile
└── .env.example
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Docker | 20+ |
| Docker Compose | 2+ |
| Poetry | 1.8+ (for local dependency management only) |

---

## Quickstart

All backend services are fully containerized. Everything starts with a single command from the project root:

```bash
docker compose build
docker compose up -d
```

| Service | URL |
|---------|-----|
| API | http://localhost/api/v1 |
| Swagger Docs | http://localhost/docs |

---

## Database

### Access the database

```bash
docker exec -it db sh
psql -U postgres -d railway
```

### Run migrations

Exec into the backend container first:

```bash
docker exec -it backend sh
```

Then inside the container:

```bash
# Generate a new migration after model changes
alembic revision --autogenerate -m "your message here"

# Apply migrations
alembic upgrade head
```

> Always run `alembic upgrade head` after pulling new changes that include model updates.

---

## Dependency Management (Poetry)

Dependencies are managed with **Poetry**. Never manually edit `pyproject.toml` or install packages with `pip`.

### Adding a new dependency

```bash
# 1. Navigate to the backend directory
cd crackmode/backend

# 2. Activate the Poetry virtual environment
poetry shell

# 3. Add the dependency
poetry add package-name

# 4. Restart the backend container to apply changes
docker compose restart backend
```

> After adding a dependency, the `pyproject.toml` and `poetry.lock` files will be updated. Commit both files.

---

## Common Docker Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start all services in the background |
| `docker compose build` | Rebuild containers after Dockerfile changes |
| `docker compose restart backend` | Restart the backend container |
| `docker compose logs -f backend` | Stream backend logs |
| `docker compose down -v` | Stop and remove all containers |
| `docker exec -it backend sh` | Shell into the backend container |
| `docker exec -it db sh` | Shell into the database container |

---

## Environment Variables

```bash
DATABASE_URL=postgresql://postgres:password@db:5432/railway
SUPABASE_URL=your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SECRET_KEY=your-secret-key
```

> Never commit your `.env` file. Copy from `.env.example` and fill in your values.

---

## Deployment

The backend is deployed on **Railway** via an automated CI/CD pipeline. Any push to `main` triggers a deployment. Separate staging and production environments are maintained — ensure you are targeting the correct environment before merging.

---

## Notes

- Migrations are not applied automatically on startup — always run `alembic upgrade head` manually after model changes.
- When adding dependencies, always use Poetry. Direct `pip install` will not persist inside the container.
- Unlike MENTspace, CrackMode's backend does not use RabbitMQ or Celery — async tasks are handled differently.

---

## License

[MIT](https://github.com/Morgan-Ngetich/crackmode/blob/main/LICENSE)
