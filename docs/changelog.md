# Changelog

All notable changes merged to `main` or `master` are recorded here.
Entries are prepended automatically after the header separator when a pull request
meets the workflow's review requirements and is successfully merged to `main` or `master`.

Current automation is based on review state:

1. The pull request is approved by **Nuxview**.
2. No reviewer has an outstanding `CHANGES_REQUESTED` review (a later approval from the same reviewer supersedes it).
3. The pull request is successfully merged to `main` or `master`.

---

## [c272272] – 2026-04-05

### docs: second-pass CHANGELOG verification – fix ordering, add missing entries

- Fixed `[Unreleased]` label → replaced with correct commit hash `[62589f9]` and added `docker-compose.yml` to its files list.
- Restored the `[0bfe4f0]` entry that was accidentally dropped in a previous edit.
- Added missing `[8327706] – 2026-04-02` entry (commit that originally created `docs/CHANGELOG.md`).
- Added missing `[22c8397] – 2026-04-05` entry (Dockerfile fix + prior CHANGELOG update).
- Corrected `[62589f9]` position to maintain strict newest-first chronological order.
- Removed a duplicate `[e6bfeb0]` entry that had crept in.

**Files changed:** `docs/CHANGELOG.md`

---

## [22c8397] – 2026-04-05

### fix: remove redundant `COPY` in `Backend/Dockerfile` and update CHANGELOG with all PR commits

- Removed the redundant `COPY entrypoint.sh /entrypoint.sh` instruction from `Backend/Dockerfile`; `COPY . .` already copies `entrypoint.sh` to `/app/entrypoint.sh`, so the `RUN sed` step and `ENTRYPOINT` now reference `/app/entrypoint.sh`.
- Added changelog entries for all commits pushed to this PR that were not yet documented (`6c95485`, `2d8ccd1`, `4921a5a`, `fdfcf68`, `e6bfeb0`, `3e17eed`, `e3e3f47`).

**Files changed:** `Backend/Dockerfile`, `docs/CHANGELOG.md`

---

## [e3e3f47] – 2026-04-05

### docs: clarify instructions for configuring frontend API URL in manual setup

- Improved wording in `README.md` for the manual (non-Docker) setup section: clarified how to configure the frontend to point to the backend when running both services without nginx.

**Files changed:** `README.md`

---

## [3e17eed] – 2026-04-05

### fix: correct backend and frontend health check endpoint paths

- Fixed leading-slash omission in `Backend/app/health/routes.py` route registrations (`backend-health` → `/backend-health`).
- Renamed `Frontend/src/app/frontend-health/route.tsx` → `route.ts` (no JSX used in the handler).
- Added `/frontend-health` to the Clerk middleware public-routes matcher in `Frontend/src/middleware.ts` so the health endpoint is accessible without authentication.

**Files changed:** `Backend/app/health/routes.py`, `Frontend/src/app/frontend-health/route.ts`, `Frontend/src/middleware.ts`

---

## [62589f9] – 2026-04-05

### feat: add root `.env.example` template and sync Docker/architecture documentation

- Added a root `.env.example` template for Docker Compose `POSTGRES_*` variable interpolation; updated the postgres service `env_file` to reference `.env` and removed the now-redundant inline `environment:` block from `docker-compose.yml`.
- Rewrote `docs/Docker.md` to match the active four-service topology (`postgres`, `backend`, `frontend`, `nginx`) with only nginx exposed on host port `80`, correct healthcheck endpoints (`/api/backend-health`, `/frontend-health`, `/nginx-health`), and updated setup instructions using `backend.env.example` / `frontend.env.example`.
- Major sync of `docs/architecture.md`: updated startup sequence (`entrypoint.sh` → `pg_isready` wait → `flask db upgrade` → Gunicorn), network topology, nginx routing flow, and current model/service details.
- Second-pass sync of `README.md`: updated top-level setup steps, access URLs (via `http://localhost`), and Docker/nginx flow to match the updated documentation.
- Updated `docs/CHANGELOG.md` to include entries for commits `6c95485`, `2d8ccd1`, `4921a5a`, and `fdfcf68`.

**Files changed:** `.env.example`, `README.md`, `docker-compose.yml`, `docs/Docker.md`, `docs/architecture.md`, `docs/CHANGELOG.md`

---

## [e6bfeb0] – 2026-04-05

### feat: rename health check endpoints and migrate nginx probe to `/nginx-health`

- Renamed backend health route from `/api/health` to `/api/backend-health` (and `/backend-health`) in `Backend/app/health/routes.py`.
- Moved frontend health route from `Frontend/src/app/health/` to `Frontend/src/app/frontend-health/` to avoid colliding with nginx's probe path.
- Updated all three `docker-compose.yml` healthcheck probes: backend now targets `/api/backend-health`, frontend targets `/frontend-health`, and nginx targets `/nginx-health`.
- Renamed the nginx health location block from `/health` to `/nginx-health` in `nginx/nginx.conf` and added `proxy_http_version 1.1` to the `/api/` proxy location.

**Files changed:** `Backend/app/health/routes.py`, `Frontend/src/app/frontend-health/route.tsx`, `docker-compose.yml`, `nginx/nginx.conf`

---

## [fdfcf68] – 2026-04-04

### chore: remove root `.env.example` and wire postgres service to `backend.env`

- Deleted the stale root `.env.example` file (superseded by `Backend/backend.env.example`).
- Added `env_file: ./Backend/backend.env` to the `postgres` service in `docker-compose.yml` so `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` are sourced from the same file as the backend, removing the need for a separate root `.env`.

**Files changed:** `.env.example`, `docker-compose.yml`

---

## [4921a5a] – 2026-04-04

### fix: add `-d "$POSTGRES_DB"` to `pg_isready` in entrypoint

- Updated `Backend/entrypoint.sh` to pass `-d "$POSTGRES_DB"` to `pg_isready`, ensuring the readiness check targets the actual application database rather than defaulting to a database matching the username.

**Files changed:** `Backend/entrypoint.sh`

---

## [2d8ccd1] – 2026-04-04

### docs: standardize product name to "ClubIQ" in architecture documentation

- Replaced all occurrences of "Club IQ" (with a space) with "ClubIQ" in `docs/architecture.md` title, introduction, and system overview for consistent branding.

**Files changed:** `docs/architecture.md`

---

## [6c95485] – 2026-04-03

### fix: update environment file references in docker-compose and nginx upstream usage

- Updated `docker-compose.yml` `env_file` entries for backend and frontend to point at the real per-developer env files (`backend.env` / `frontend.env`) instead of the `.example` templates.
- Changed `/api/` proxy pass in `nginx/nginx.conf` from `http://backend:5000` to `http://backend` (using the declared upstream) to avoid configuration drift.
- Minor security-note improvements in `docs/architecture.md`.

**Files changed:** `docker-compose.yml`, `nginx/nginx.conf`, `docs/architecture.md`

---

## [8327706] – 2026-04-02

### docs: add timestamped CHANGELOG.md to docs directory

- Created `docs/CHANGELOG.md` with timestamped entries covering all commits in the PR from `37ae5ea` through `0bfe4f0`, providing a full audit trail of changes.

**Files changed:** `docs/CHANGELOG.md`

---

## [0bfe4f0] – 2026-04-01

### revert: restore `wget --spider` in healthchecks per user testing confirmation

- Reverted the frontend and nginx Docker Compose healthcheck probes from `wget -qO-` back to `wget --no-verbose --spider`, which was confirmed to work correctly on both `node:20-alpine` and `nginx:alpine` BusyBox `wget` implementations.

**Files changed:** `docker-compose.yml`

---

## [3caf9a0] – 2026-04-01

### fix: address review comments – healthchecks, env files, entrypoint command, and docs

- Removed the `command: flask run ...` override from the backend service in `docker-compose.yml` so the entrypoint's Gunicorn invocation is not shadowed.
- Updated the backend and frontend `env_file` references to point to `backend.env` and `frontend.env` (copied from their respective `.example` files by contributors during setup).
- Updated `docs/architecture.md` to reflect that pgAdmin has been removed and nginx is the reverse proxy, and corrected the startup sequence to describe the `pg_isready`-based readiness check.

**Files changed:** `docker-compose.yml`, `docs/architecture.md`

---

## [e1f6c30] – 2026-04-01

### fix: update `.gitignore` and Docker documentation, correct service names and environment file references

- Added `backend.env` and `frontend.env` to `.gitignore` so secrets are not accidentally committed.
- Updated `docs/Docker.md` to use the correct service names and new environment file names (`backend.env.example` / `frontend.env.example`).
- Corrected the nginx `upstream backend` reference in `nginx/nginx.conf` to point to `backend:5000` (the correct port for the Flask/Gunicorn service).
- Updated `docs/architecture.md` to replace the pgAdmin reference with nginx.

**Files changed:** `.gitignore`, `docs/Docker.md`, `docs/architecture.md`, `nginx/nginx.conf`

---

## [78fa49a] – 2026-03-31

### fix: update environment files for Flask and Clerk settings, enhance Makefile and docker-compose health checks

- Added missing `FLASK_APP` and `FLASK_ENV` variables to `Backend/backend.env.example`.
- Added missing Clerk environment variable placeholders to `Frontend/frontend.env.example`.
- Corrected Makefile targets that referenced outdated variable or service names.
- Removed duplicate or conflicting entries from `docker-compose.yml`.

**Files changed:** `Backend/backend.env.example`, `Frontend/frontend.env.example`, `Makefile`, `docker-compose.yml`

---

## [19226aa] – 2026-03-31

### fix: update Dockerfile and environment files, improve healthcheck endpoints in docker-compose and nginx configuration

- Renamed `Backend/.env.example` → `Backend/backend.env.example` and `Frontend/.env.example` → `Frontend/frontend.env.example` for clearer distinction between services.
- Updated `Backend/Dockerfile` to use a relative path for the entrypoint script.
- Streamlined `docker-compose.yml`: corrected healthcheck URLs to use `/api/health` for backend and `/health` for frontend, and updated `env_file` references to the renamed example files.
- Fixed `nginx/nginx.conf` upstream backend port from `8000` to `5000`.

**Files changed:** `Backend/Dockerfile`, `Backend/backend.env.example` (renamed), `Frontend/frontend.env.example` (renamed), `docker-compose.yml`, `nginx/nginx.conf`

---

## [763e2de] – 2026-03-24

### fix: resolve nginx unhealthy service status and improve per-service healthcheck JSON responses

- Fixed the Docker Compose `depends_on` condition syntax: changed malformed YAML (empty `condition:` key) to the correct inline form `condition: service_healthy` for backend, frontend, and nginx services.
- Updated the backend health route (`Backend/app/health/routes.py`) to return a standardized JSON response.
- Updated the frontend health route (`Frontend/src/app/health/route.tsx`) to return a consistent JSON response.
- Added the `/health` location block to `nginx/nginx.conf` so nginx itself can respond to healthcheck probes.

**Files changed:** `Backend/app/health/routes.py`, `Frontend/src/app/health/route.tsx`, `docker-compose.yml`, `nginx/nginx.conf`

---

## [5fe5800] – 2026-03-23

### feat: current repo changes – nginx, healthchecks, Makefile overhaul, and Docker improvements

- Added the nginx service to `docker-compose.yml` with its own healthcheck and `depends_on` gating on backend and frontend.
- Added per-service healthchecks for postgres, backend, and frontend containers.
- Added a backend health API endpoint at `/api/health` (`Backend/app/health/routes.py`).
- Added a frontend health API route at `/health` (`Frontend/src/app/health/route.tsx`).
- Overhauled the `Makefile`: colorized output, improved `help` target, renamed `start-db` targets to `start-postgres`, removed pgAdmin targets, added nginx targets, and fixed `.PHONY` declarations.
- Removed the pgAdmin service from `docker-compose.yml`.
- Optimized Docker Compose build contexts for backend and frontend to reduce image build times.
- Updated `Backend/Dockerfile` paths and `Backend/entrypoint.sh` to use `pg_isready` for robust PostgreSQL readiness checks.
- Updated `Frontend/Dockerfile` for consistency.
- Updated the Next.js page title and metadata to "ClubIQ".
- Updated `Backend/.env.example` to include `POSTGRES_DB` and use it in `DATABASE_URL`.
- Expanded `.gitignore` with additional entries.

**Files changed:** `.gitignore`, `Backend/.env.example`, `Backend/Dockerfile`, `Backend/app/health/routes.py`, `Backend/entrypoint.sh`, `Frontend/Dockerfile`, `Frontend/src/app/health/route.tsx`, `Frontend/src/app/layout.tsx`, `Makefile`, `docker-compose.yml`, `nginx/nginx.conf`

---

## [37ae5ea] – 2026-03-13

### feat: add nginx reverse proxy and architecture documentation

- Added `nginx/nginx.conf` configuring nginx as a reverse proxy: routes `/api/` traffic to the Flask backend (port 5000) and all other traffic to the Next.js frontend (port 3000).
- Updated `docker-compose.yml` to include the nginx service and restructure the network topology so only nginx is exposed on host port 80; backend, frontend, and postgres communicate on the internal `clubiq-network`.
- Updated `Backend/Dockerfile` and `Frontend/Dockerfile` for improved build context alignment.
- Moved `Docker.md` into the `docs/` directory.
- Added `docs/architecture.md` documenting the full system architecture, tech stack, data models, API structure, and deployment topology.

**Files changed:** `Backend/Dockerfile`, `Frontend/Dockerfile`, `docker-compose.yml`, `docs/Docker.md` (moved from root), `docs/architecture.md` (new), `nginx/nginx.conf` (new)
