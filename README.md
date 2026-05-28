# ClubIQ

<p align='center'>
<img src="https://img.shields.io/badge/Python-3.10+-blue?logo=python">
<img src="https://img.shields.io/badge/Flask-Backend-black?logo=flask">
<img src="https://img.shields.io/badge/Next.js-Frontend-black?logo=nextdotjs">
<img src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql">
<img src="https://img.shields.io/badge/Docker-Containerized-blue?logo=docker">
<img src="https://img.shields.io/badge/Clerk-Authentication-4F46E5?logo=clerk">
<img src="https://img.shields.io/badge/License-MIT-green">
<img src="https://img.shields.io/badge/Maintained-Yes-brightgreen.svg">
<img src="https://img.shields.io/github/contributors/tomi3-11/ClubIQ">
</p>

![Logo](frontend/public/images/readme-logo.png)

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

<!--toc:start-->
- [ClubIQ](#clubiq)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Setup and Installation](#setup-and-installation)
    - [Step 1: Install Docker](#step-1-install-docker)
    - [Step 2 (Windows Recommended): Setup Node in WSL with NVM](#step-2-windows-recommended-setup-node-in-wsl-with-nvm)
    - [Step 3: Install Make (Optional)](#step-3-install-make-optional)
  - [Docker Quick Start](#docker-quick-start)
  - [Manual Setup](#manual-setup)
    - [Backend (without Docker)](#backend-without-docker)
    - [Frontend (without Docker)](#frontend-without-docker)
  - [API Reference](#api-reference)
  - [Testing](#testing)
  - [Contribution Guide](#contribution-guide)
  - [License](#license)
<!--toc:end-->

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

Have a look at the [structure.md](structure.md) to get an full overview of the project structure.

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

`gnu make` is optional but we highly recommend installing it.

Install it by either visiting the [official Make website](https://www.gnu.org/software/make/) or using your package manager.


## Docker Quick Start

See [docs/docker.md](/docs/docker.md) for detailed Docker usage.

1. Create service env files from templates:

```bash
cp .env.example .env
cp Backend/backend.env.example Backend/backend.env
cp Frontend/frontend.env.example Frontend/frontend.env
```

2. Set `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` in both `.env` and `Backend/backend.env` so Compose interpolation and container runtime use the same database credentials.

3. Build and start services:

```bash
make build
```

4. Open the app at <http://localhost>.

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
