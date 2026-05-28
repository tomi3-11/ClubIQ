# ClubIQ

![Python](https://img.shields.io/badge/Python-3.12+-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-Backend-black?logo=flask)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black?logo=nextdotjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-4F46E5?logo=clerk)

## Overview

ClubIQ is a full-stack platform for managing clubs, activities, members, invitations, and ratings.

It includes:

- Flask REST API backend
- Next.js frontend (App Router)
- PostgreSQL database
- Docker Compose local environment
- nginx reverse proxy for unified local access
- Clerk-based authentication

## Table of Contents

1. [Project Structure](#project-structure)
1. [Setup and Installation](#setup-and-installation)
1. [Docker Quick Start](#docker-quick-start)
1. [Manual Setup](#manual-setup)
1. [API Reference](#api-reference)
1. [Testing](#testing)
1. [Contribution Guide](#contribution-guide)
1. [License](#license)

## Project Structure

```text
ClubIQ/
|-- .env.example
|-- Backend/
|   |-- app/
|   |-- config.py
|   |-- requirements.txt
|   |-- backend.env.example
|   `-- entrypoint.sh
|-- Frontend/
|   |-- src/
|   |-- package.json
|   `-- frontend.env.example
|-- docs/
|   |-- Docker.md
|   `-- architecture.md
|-- nginx/
|   `-- nginx.conf
|-- docker-compose.yml
|-- Makefile
|-- README.md
`-- .gitignore
```

## Setup and Installation

Works on Linux, macOS, and Windows.

### Step 1: Install Docker

Install Docker and Docker Compose.

- Docker Desktop: <https://www.docker.com/products/docker-desktop/>
- Linux Engine + Compose plugin are also supported.

Ensure the Docker daemon is running before using `docker compose` or `make` targets.

### Step 2 (Windows Recommended): Setup Node in WSL with NVM

If you are developing on Windows, use WSL for the Node toolchain.

Install NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
```

Install Node LTS:

```bash
nvm install --lts
nvm use --lts
```

Verify:

```bash
which node
which npm
node -v
npm -v
```

### Step 3: Install Make (Optional)

`make` is optional but recommended for common Docker workflows.

- macOS:

```bash
brew install make
```

- Debian/Ubuntu:

```bash
sudo apt install make
```

- Fedora:

```bash
sudo dnf install make
```

- Arch:

```bash
sudo pacman -S make
```

## Docker Quick Start

See [docs/docker.md](/docs/docker.md) for detailed Docker usage.

1. Create service env files from templates:

```bash
cp .env.example .env
cp Backend/backend.env.example Backend/backend.env
cp Frontend/frontend.env.example Frontend/frontend.env
```

1. Set `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` in both `.env` and `Backend/backend.env` so Compose interpolation and container runtime use the same database credentials.

1. Build and start services:

```bash
make build
```

1. Open the app at <http://localhost>.

Current Docker access model:

- `nginx` is the only host-exposed service (port `80`).
- `backend` and `frontend` are internal services behind nginx.
- `/api/*` routes to backend, all other routes route to frontend.

Useful commands:

```bash
make up
make up-detached
make logs-all
make down
make help
```

## Manual Setup

### Backend (without Docker)

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
flask run
```

Backend manual default: <http://localhost:5000>

### Frontend (without Docker)

```bash
cd Frontend
npm install
npm run dev
```

Frontend manual default: <http://localhost:3000>

If running both manually (without nginx), configure the frontend to point to the backend:


## API Reference

Base URLs:

- Docker (through nginx): `http://localhost/api`
- Manual local (no nginx): `http://localhost:5000/api`
- Production: `https://yourdomain.com/api`

In Docker mode, keep `.env` and `Backend/backend.env` aligned: root `.env` feeds Compose interpolation and `Backend/backend.env` provides the container env values.

Endpoint documentation:

- [Authentication](Backend/endpoint_documentation/authentication.md)
- [Clubs](Backend/endpoint_documentation/clubs.md)
- [Members](Backend/endpoint_documentation/members.md)
- [Activities](Backend/endpoint_documentation/activities.md)
- [Rating](Backend/endpoint_documentation/ratings.md)
- [Invitations](Backend/endpoint_documentation/invitations.md)

## Testing

Backend tests:

```bash
cd Backend
pytest
```

Or in Docker:

```bash
docker compose exec backend pytest
```

## Contribution Guide

Workflow:

1. Fork and clone.

```bash
git clone https://github.com/USIU-ClubIQ/ClubIQ.git
cd ClubIQ
```

1. Switch to `main` and pull latest.

```bash
git checkout main
git pull origin main
```

1. Create a feature branch.

```bash
git checkout -b feature/<task-name>
```

1. Work, commit, and push.

```bash
git add .
git commit -m "Implement <feature>"
git push origin feature/<task-name>
```

1. Open a pull request from `feature/<task-name>` to `main`.

## License

MIT License.
