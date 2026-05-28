# ClubIQ Docker Guide

## Overview

This document explains how to run ClubIQ locally with Docker Compose.

The current stack runs four services:

- postgres (PostgreSQL 16)
- backend (Flask + Gunicorn)
- frontend (Next.js dev server)
- nginx (reverse proxy exposed on host port 80)

The backend container waits for PostgreSQL readiness with pg_isready, then runs flask db upgrade during startup.

---

## 1. Prerequisites

Before running containers, install:

- Docker 20+
- Docker Compose v2+
- Make (optional, recommended)

---

## 2. Service Topology

| Service | Role | Internal Port | Host Port |
| --- | --- | --- | --- |
| nginx | Reverse proxy entrypoint | 80 | 80 |
| frontend | Next.js app (dev mode) | 3000 | not exposed directly |
| backend | Flask API via Gunicorn | 5000 | not exposed directly |
| postgres | PostgreSQL database | 5432 | not exposed directly |

Important:

- Access the app through <http://localhost> (nginx).
- The backend and frontend are reached through nginx routing:
  - /api/* -> backend
  - all other routes -> frontend

---

## 3. Health Checks

Current Compose healthcheck endpoints:

- backend: <http://localhost:5000/api/backend-health>
- frontend: <http://localhost:3000/frontend-health>
- nginx: <http://localhost/nginx-health>
- postgres: pg_isready

Service startup is gated with depends_on condition: service_healthy.

---

## 4. Environment Setup

Copy service environment templates:

```bash
cp .env.example .env
cp Backend/backend.env.example Backend/backend.env
cp Frontend/frontend.env.example Frontend/frontend.env
```

Root `.env` is required for Docker Compose interpolation. Keep the database values in `.env` aligned with `Backend/backend.env`.

Set your database credentials in both `.env` and `Backend/backend.env`:

- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB

Minimum backend variables you should set:

- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- CLERK_SECRET_KEY

Minimum frontend variables you should set:

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY

---

## 5. Build and Run

With Make:

```bash
make build
```

Without Make:

```bash
docker compose up --build
```

Open:

- App: <http://localhost>
- Nginx health: <http://localhost/nginx-health>

For command discovery:

```bash
make help
```

---

## 6. Common Commands

```bash
make up-detached
make logs-all
make logs-backend
make logs-frontend
make logs-nginx
make down
make down-volumes
```

Manual migration command:

```bash
docker compose exec backend flask db migrate -m "auto migration"
docker compose exec backend flask db upgrade
```

---

## 7. Troubleshooting

| Problem | Fix |
| --- | --- |
| Compose warns that POSTGRES_* are unset | Ensure `.env` exists at the repo root and `Backend/backend.env` includes POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB |
| Backend fails DB connection | Ensure DATABASE_URL in Backend/backend.env points to host postgres on port 5432 |
| App loads but API calls fail | Set NEXT_PUBLIC_API_URL to <http://localhost/api> in Frontend/frontend.env |
| Healthchecks fail | Verify endpoints are /api/backend-health, /frontend-health, and /nginx-health |
| Need clean database state | Run make down-volumes |
