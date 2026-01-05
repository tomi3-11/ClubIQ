# 🐳 **ClubIQ Docker Guide**

## Overview

This document explains how to build and run the **ClubIQ** Club Management System locally using Docker.
It includes the **Flask backend**, **Next.js frontend**, and **PostgreSQL database**.

The setup automatically handles:

* Database initialization and migrations
* Hot reloading for both backend and frontend
* Persistent Postgres storage

---

## 1. Prerequisites

Before running the containers, ensure you have:

* **Docker** ≥ 20.x
* **Docker Compose** plugin ≥ v2.0
* **Make** (optional, for easier commands)

---

## 2. Project Services

| Service      | Description                                        | Port   |
| ------------ | -------------------------------------------------- | ------ |
| **frontend** | Next.js development server (Clerk auth integrated) | `3000` |
| **backend**  | Flask API (with SQLAlchemy + migrations)           | `5000` |
| **db**       | PostgreSQL 16 (persistent volume)                  | `5432` |

---

## 3. Directory Layout

```bash
ClubIQ/
├── Backend/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── requirements.txt
│   ├── app/
│   │   ├── models.py
│   │   └── ...
│   └── .env.example
│
├── Frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── .env.example
│
├── docker-compose.dev.yml
├── Makefile
├── .dockerignore
└── Docker.md
```

---

## 4. Environment Setup

Copy and configure the example environment files:

```bash
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

Then open both `.env` files and replace values as needed:

**Backend/.env**

```bash
# Flask settings
FLASK_APP=run.py
FLASK_ENV=development

# Database settings
DATABASE_URL=postgresql://postgres:postgres@db:5432/clubiq

# Clerk settings
CLERK_SECRET_KEY=your-clerk-secret-key

# Optional debug settings
DEBUG=True
```

**Frontend/.env**

```bash
# API and app URLs
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

---

## 5. Build & Run

Run all containers with:

```bash
make build
```

This automatically:

* Builds all images
* Initializes and migrates the database
* Launches the Flask + Next.js servers

Visit your app at:

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5000](http://localhost:5000)

To view the full list of commands provided through the Make file, run:

```bash
make help
```

---

## 6. Manual Docker Commands

If you don’t have `make` installed:

```bash
docker compose up --build
docker compose down
docker compose exec backend flask db upgrade
```

---

## 7. SSL Certificate Management

pgAdmin is configured with SSL certificates for secure connections. For details on certificate renewal and rotation:

📄 See **[pgadmin/SSL_CERTIFICATE_MANAGEMENT.md](./pgadmin/SSL_CERTIFICATE_MANAGEMENT.md)**

**Important**: The current SSL certificate expires on **January 3, 2027**. Plan to renew it before this date.

---

## 8. Possible Issues

| Problem                                         | Fix                                                              |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| Containers build but backend crashes on startup | Check `.env` and ensure `DATABASE_URL` matches service name `db` |
| Frontend can’t reach API                        | Confirm `NEXT_PUBLIC_API_URL=http://localhost:5000`              |
| Migrations not running                          | Run `make migrate` manually inside backend container             |
| Database persists unwanted data                 | Run `make down` to reset Postgres volume                        |

---
