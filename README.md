# AI Tanym — Test Task

Full-stack app with token-authenticated REST API and a React personal cabinet. After login, users see their client info (name, email, phone, address) and can edit it.

## Stack

- Backend: Django 5 + Django REST Framework
- Frontend: React 19 + Vite + React Router
- Database: PostgreSQL 17
- Auth: DRF TokenAuthentication
- Containerization: Docker + Docker Compose

## Quick start

Requires Docker Desktop.

```bash
# 1. Copy the env template
cp .env.example .env

# 2. Build and start everything
docker compose up --build

# 3. In a second terminal, create a superuser
docker compose exec backend python manage.py createsuperuser
```

Open **http://localhost** in your browser, log in with the superuser credentials you just created.

## Services

| Service  | URL                       | Host Port |
| -------- | ------------------------- | --------- |
| Frontend | http://localhost          | 80        |
| Backend  | http://localhost:81/api/  | 81        |
| Postgres | localhost:5433            | 5433      |

## API endpoints

All return JSON. Endpoints under `/api/client/` require `Authorization: Token <key>` header.

| Method | Path          | Description                  |
| ------ | ------------- | ---------------------------- |
| POST   | /api/login/   | Returns `{token, username}`  |
| GET    | /api/client/  | Current user's client info   |
| PUT    | /api/client/  | Replace all client fields    |
| PATCH  | /api/client/  | Update specific fields       |

## Postman testing

A `postman_collection.json` is included with all four requests pre-configured.

1. Open Postman → **Import** → drag in `postman_collection.json`
2. Edit the `POST Login` request body with your superuser's username/password
3. Run **POST Login** first — its test script auto-saves the returned token to a collection variable
4. Run the other requests in any order — they reuse `{{token}}` automatically

## Project structure

.
├── docker-compose.yml      # 3 services: db, backend, frontend
├── Dockerfile              # Backend image (python:3.13-slim)
├── frontend/Dockerfile     # Frontend image (multi-stage: node build → nginx)
├── frontend/nginx.conf     # Serves React + proxies /api to backend
├── backend/                # Django project settings, urls
├── api/                    # Single Django app: models, views, serializers, urls
├── frontend/src/           # React app (LoginPage, CabinetPage, api lib)
├── requirements.txt
├── .env.example
└── postman_collection.json

## Running locally without Docker

Possible but requires switching `DB_HOST=localhost` and `DB_PORT=5433` in `.env`, and having Postgres reachable on `5433`. Easiest path is to keep the db container running (`docker compose up db`) and run Django on the host:

```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Production notes

This codebase is configured for development. Before deploying:

- Set `DEBUG=False` in `.env`
- Replace `CORS_ALLOW_ALL_ORIGINS = True` in `backend/settings.py` with an explicit `CORS_ALLOWED_ORIGINS` list
- Use `gunicorn` instead of `runserver` (update the backend service's `command:` in `docker-compose.yml`)
- Generate a real `SECRET_KEY` and store it in a secrets manager, not in `.env`
- Restrict `ALLOWED_HOSTS` to your actual domain
