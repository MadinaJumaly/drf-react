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
