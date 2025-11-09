# **Club IQ**

<p align='center'>
<img src="https://img.shields.io/badge/Python-3.12+-blue?logo=python" alt="Python">
<img src="https://img.shields.io/badge/Flask-Backend-black?logo=flask" alt="Flask">
<<<<<<< HEAD
<img src="https://img.shields.io/badge/Next.js-Frontend-000000?logo=nextdotjs" alt="Next.js">
<img src="https://img.shields.io/badge/Clerk-Authentication-4F46E5?logo=clerk" alt="Clerk">
<img src="https://img.shields.io/badge/Docker-Containerized-blue?logo=docker" alt="Docker">
<img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

## Project Description

**Club IQ** is a modern full-stack web application designed to help clubs manage activities, members, and events efficiently.
=======
<img src="https://img.shields.io/badge/Next.js-Frontend-black?logo=nextdotjs" alt="Next.js">
<img src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql" alt="PostgreSQL">
<img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

---
>>>>>>> 31e2a7a (fix: readme and makefile overhaul)

# **Overview**

<<<<<<< HEAD
* A **Flask REST API** backend
* A **Next.js (App Router) frontend** with Clerk authentication
* A **Docker-based containerized environment** for both backend and frontend
=======
**Club IQ** is a modern full-stack platform for club management — handling members, events, attendance, authentication, and more.
The system is split into two clean components:

* ✅ **Flask REST API** backend
* ✅ **Next.js frontend**
* ✅ **PostgreSQL database** for strong relational structure
* ✅ Dockerized environment for consistent development
* ✅ Scalable architecture designed for real clubs and organizations

---
>>>>>>> 31e2a7a (fix: readme and makefile overhaul)

# **Table of Contents**

<<<<<<< HEAD
---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Docker Setup](#docker-setup)
6. [Manual Installation](#manual-installation)
7. [API Reference](#api-reference)
    * [Authentication](#authentication)
    * [Members](#members)
8. [Testing](#testing)
9. [Contribution Guide](#how-to-contribute-to-this-project)
10. [License](#license)

---

## Overview

* The **Backend (Flask)** exposes RESTful API endpoints for authentication, user management, and (future) event handling.
* The **Frontend (Next.js + Clerk)** consumes these APIs, provides secure authentication, and delivers a clean, responsive UI for members and admins.
* The entire application is **containerized using Docker**, ensuring consistent environments across Windows, macOS, and Linux.

---

## Project Structure

```bash
ClubIQ/
│
│── Backend/                # Flask backend (API)
│   ├── app/
│   ├── requirements.txt
│   ├── entrypoint.sh
│   └── Dockerfile
│
│── Frontend/               # Next.js + Clerk frontend (UI)
│   ├── app/
│   ├── package.json
│   ├── next.config.js
│   └── Dockerfile
│
│── docker-compose.yml      # Combined setup for backend + frontend
│── README.md               # Documentation
│── .gitattributes          # Fixes entrypoint.sh on Windows
=======
1. [Project Structure](#project-structure)
2. [Setup & Installation](#setup--installation)
3. [Backend Guide](#backend-setup)
4. [Frontend Guide](#frontend-setup)
5. [API Reference](#api-reference)
6. [Testing](#testing)
7. [Contribution Guide](#contribution-guide)
8. [License](#license)

---

# **Project Structure**

```
ClubIQ/
│── Backend/          # Flask backend
│   ├── app/
│   ├── instance/
│   ├── Config.py
│   ├── requirements.txt
│
│── Frontend/         # Next.js frontend
│   ├── app/
│   ├── package.json
│   ├── next.config.mjs
│
│── docker-compose.dev.yml
│── Makefile
│── README.md
>>>>>>> 31e2a7a (fix: readme and makefile overhaul)
│── .gitignore
```

---
<<<<<<< HEAD

## Features

* **User Management** (register, view users, CRUD operations)
* **Clerk Authentication** (Sign up, Sign in, and Session handling)
* **Flask REST API** with modular blueprints
* **Dockerized** backend & frontend for easy setup
* **Next.js 16** for fast SSR/CSR rendering
* **Tailwind CSS v4** for styling
* **Hot reload** support in both containers
* **Axios Integration** for API calls
* **Easy configuration** for dev & prod environments
* **Cross-platform compatibility** (Windows, Linux, macOS)
<!-- - Roadmap: Event scheduling, notifications, role-based access -->

---

## Tech Stack

| Layer                    | Technology                               |
| ------------------------ | ---------------------------------------- |
| **Frontend**             | Next.js 16, Clerk, TailwindCSS |
| **Backend**              | Python 3.12, Flask, PostgreSQL           |
| **Authentication**       | Clerk (Next.js middleware integration)   |
| **Containerization**     | Docker, Docker Compose                   |
| **Deployment (Planned)** | Render / Vercel                          |
| **Future Additions**     | Reverse proxies, OS detection for builds |

---

## Docker Setup

### Prerequisites

* Docker, Docker Compose and Make installed
* `.env` files configured for Clerk and Flask API (e.g. `CLERK_PUBLISHABLE_KEY`, `DATABASE_URL`)

### Build and Run

Checkout the [**Docker.md**](./Docker.md) file for the full installation and setup as well as notes on our __Make Commands__.
=======

# **Setup & Installation**

This project supports **Windows**, **WSL**, and **Linux**.
Follow each step IN ORDER — or you’ll spend 3 hours debugging what should’ve taken 30 seconds.
>>>>>>> 31e2a7a (fix: readme and makefile overhaul)

---

# ✅ **STEP 1 — Install Docker Desktop**

Download:
**[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)**

During installation:
✅ Enable **Hyper-V / Virtualization**
✅ Enable **WSL2 backend**

If Docker can’t run containers, nothing else matters.

---

# ✅ **STEP 2 — (Recommended) Setup Node in WSL using NVM**

If you're on Windows, develop in **WSL**, not PowerShell.
It avoids path conflict nightmares with npm, Next.js, and node-gyp.

### Install NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
```

### Install Node (LTS)

```bash
nvm install --lts
nvm use --lts
```

### Confirm WSL versions (not Windows)

```bash
which node
which npm
node -v
npm -v
```

Paths should start with `/usr/bin` or your WSL home.

---

# ✅ **STEP 3 — Install Make (Windows only)**

If you’re using Windows without WSL, install GNU Make:

**[https://gnuwin32.sourceforge.net/downlinks/make.php](https://gnuwin32.sourceforge.net/downlinks/make.php)**

Then add it to PATH.
Test it:

```bash
make help
```

---

# ✅ **STEP 4 — Using the Makefile**

The Makefile simplifies common Docker operations:

### Build all containers

```bash
make build
```

### Start services (attached)

```bash
make up
```

### Detached mode

```bash
make up-d
```

### Logs

```bash
make logs
```

### Shell inside containers

```bash
make front
make back
```

### Clean everything

```bash
make clean
```

---

# ✅ Backend Setup

<<<<<<< HEAD
### Notes for Windows users

If you get an error like:

```
/entrypoint.sh: not found
```

Make sure `.gitattributes` enforces LF endings:

```
*.sh text eol=lf
```

Then rebuild your containers:

```bash
docker compose build --no-cache <container_name>
```

---

## Manual Installation

If you prefer running without Docker:

### Backend

```bash
cd Backend
=======
```bash
cd Backend

>>>>>>> 31e2a7a (fix: readme and makefile overhaul)
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

<<<<<<< HEAD
pip install -r requirements.txt
flask run
```

### Frontend
=======
# Activate
source venv/bin/activate          # Linux/macOS/WSL
venv\Scripts\activate             # Windows

pip install -r requirements.txt

flask run
```

Environment variables are managed via `.env` inside `instance/`.

---

# ✅ Frontend Setup (Next.js)
>>>>>>> 31e2a7a (fix: readme and makefile overhaul)

```bash
cd Frontend

npm install
npm run dev
```

<<<<<<< HEAD
---

## API Reference (Flask)

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://yourdomain.com/api`
=======
Your UI lives at:
[http://localhost:3000](http://localhost:3000)
>>>>>>> 31e2a7a (fix: readme and makefile overhaul)

---

# **API Reference**

### Base URLs

* Dev: `http://localhost:5000/api`
* Prod: `https://yourdomain.com/api`

### Authentication Example

**POST** `/login`

Request:

```json
{
    "email": "tomi@example.com",
    "password": "mysecretpassword"
}
```

Response:

```json
{
    "access_token": "jwt_token_string",
    "token_type": "Bearer"
}
```

### Members Example

**GET** `/members`
Headers:

```
Authorization: Bearer <token>
```

Response:

```json
[
    {"id": 1, "name": "Tom", "email": "tom@example.com"}
]
```

---

<<<<<<< HEAD
## Testing
=======
# **Testing**
>>>>>>> 31e2a7a (fix: readme and makefile overhaul)

### Backend

```bash
cd Backend
pytest
```

### Frontend

<<<<<<< HEAD
```bash
cd Frontend
npm run test
```

---

## How to Contribute to This Project

#### 1. Fork the repository on GitHub.

#### 2. Clone the repository in your terminal.
```bash
    git clone https://github.com/<your-username>/<repo-name>.git
    cd <repo-name>
```

#### 3. Create a feature branch:
```bash
git checkout -b feature-name
```

#### 4. Commit your changes:
```bash
git commit -m "Added feature"
```

#### 5. Push to the branch:
```bash
git push origin feature-name
```

#### 6. Open a pull request on GitHub

---

### Visual Contribution Work flow
<p align="center">
    <!-- [Workflow](./static/images/contribution_work_flow.png) -->
    <img src="./static/images/contribution_work_flow.png" alt="Work Flow">
</p>

---

### Tips for good Pull Request
- Break big changes into smaller PRs.

- Provide screenshots or examples if it’s a UI change.

- Reference issues if applicable: `Fixes #issue-number`.

- Keep your branch up to date with the main repo:

```bash
git remote add upstream https://github.com/<original-owner>/<repo-name>.git
git fetch upstream
=======
Coming soon.

---

# **Contribution Guide**

All contributors must follow the workflow below.

---

## ✅ **Developer Workflow**

### **1. Pull latest main**

```bash
>>>>>>> 31e2a7a (fix: readme and makefile overhaul)
git checkout main
git pull origin main
```

### **2. Create your feature branch**

```bash
git checkout -b feature/<task-name>
```

<<<<<<< HEAD
### Ready to manage your club smarter? Welcome to Club IQ!
#### Happy Coding
---
=======
### **3. Code → Commit → Push frequently**

```bash
git add .
git commit -m "Implement <feature name>"
git push origin feature/<task-name>
```

### **4. Open a Pull Request**

* PR: your branch → `main`
* Assign your team lead
* Clear title
* Short description of what changed

---

# **License**

Distributed under the MIT License.
>>>>>>> 31e2a7a (fix: readme and makefile overhaul)
