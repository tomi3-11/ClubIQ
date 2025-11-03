# 🐳 **ClubIQ Docker Guide**

## Overview

This document explains how to build and run the **ClubIQ** Club Management System locally using Docker.
It includes the **Flask backend**, **Next.js frontend**, and **PostgreSQL database**.

The setup automatically handles:

* Database initialization and migrations
* Demo data seeding (5 members including one admin)
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
│   │   ├── seed.py
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
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://postgres:postgres@db:5432/clubiq
```

**Frontend/.env**

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

---

## 5. Build & Run

Run all containers with:

```bash
make up
```

This automatically:

* Builds all images
* Initializes and migrates the database
* Seeds demo members
* Launches the Flask + Next.js servers

Visit your app at:

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 6. Make Cheatsheet

| Command        | Description                                  |
| -------------- | -------------------------------------------- |
| `make up`      | Build and start containers                   |
| `make down`    | Stop and remove containers                   |
| `make rebuild` | Rebuild all containers from scratch          |
| `make logs`    | View combined container logs                 |
| `make shell`   | Access a shell inside the backend container  |
| `make migrate` | Manually run Flask migrations                |
| `make seed`    | Manually re-seed the database                |
| `make clean`   | Remove all containers, networks, and volumes |

---

## 7. Manual Docker Commands

If you don’t have `make` installed:

```bash
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml exec backend flask db upgrade
docker compose -f docker-compose.dev.yml exec backend python app/seed.py
```

---

## 8. Persistent Database Volume

The PostgreSQL service stores data in a Docker-managed volume called `pgdata`.
To reset your database completely (including schema and seed data):

```bash
make clean
make up
```

---

## 9. Possible Issues

| Problem                                         | Fix                                                              |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| Containers build but backend crashes on startup | Check `.env` and ensure `DATABASE_URL` matches service name `db` |
| Frontend can’t reach API                        | Confirm `NEXT_PUBLIC_API_URL=http://localhost:5000`              |
| Migrations not running                          | Run `make migrate` manually inside backend container             |
| Database persists unwanted data                 | Run `make clean` to reset Postgres volume                        |

---
