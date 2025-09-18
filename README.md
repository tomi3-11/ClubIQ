# Club IQ

<p align='center'>
<img src="https://img.shields.io/badge/Python-3.10+-blue?logo=python" alt="Python">
<img src="https://img.shields.io/badge/Flask-Backend-black?logo=flask" alt="Flask">
<img src="https://img.shields.io/badge/React-Frontend-61dafb?logo=react" src="React">
<img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

## Project Description
__Club IQ__ is a modern full-stack web application designed to help clubs manage activities, members, and events efficiently.

It combines:

- A __Flask REST API__ backend

- A __React + Vite__ frontend

- Future features: __JWT authentication__, __role-based access__, __event scheduling__, and __notifications__

This project is a blueprint for building a __production-ready full-stack application__ with a clean separation between backend and frontend.

## Tabel of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Installation & Setup](#project-set-up--installation)
6. [API Reference](#api-reference)
    - [Authentication](#authentication)
    - [Members](#members)
7. [Testing](#testing)
8. [Contribution Guide](#how-to-contribute-to-this-project)
9. [License](#license)

## Overview
- The __Backend (Flask)__ exposes RESTful API endpoints for authentication, user management, and (future) event scheduling.
- The __Frontend (React + Vite)__ consumes these APIs and provides a clean, responsive UI for members and admins.
- Designed to be __modular and scalable__, making it easy to extend with new features.


## Project Structure

```bash

ClubIQ/
│── Backend/          # Flask backend (API)
│   ├── app/
|   |   ├── Config.py
|   |   └── ...
│   ├── requirements.txt
│   ├── instance/
│   └── ...
│
│── Frontend/         # React + Vite frontend (UI)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       └── api.js
│
│── README.md         # Main documentation (API + project info)
│── .gitignore
```

## Features
- JWT Authentication (login & token-based access)
- User Management (register, view users, CRUD operations)
- RESTful API with Flask
- React + Vite Frontend for fast development
- Axios Integration for API calls
- Easy configuration for dev & prod environments
<!-- - Roadmap: Event scheduling, notifications, role-based access -->

## Tech Stack

- __Backend__: Python, Flask, SQLite (PostgreSQL -> Later integration)
- __Frontend__: React, Vite, Axios, TailwindCSS
- __Authentication__: JWT
- __Deployment__: Docker, Render, Vercel (TBD)


## Project set up & Installation
### Backend
```bash
cd Backend

# Create a virtual environment
python -m venv venv

# Activate
source venv/bin/activate # On Linux / Mac
venv\scripts\activate # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
flask run
```

### Frontend
```bash
cd Frontend
npm install
npm run dev

```

## API Reference
### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://yourdomain.com/api`

### Authentication

#### GET `/register`
Request:
```json
{
    "user_name": "tomi",
    "email": "tomi@example.com",
    "password": "mysecretpassword",
    "confirm_password": "mysecretpassword"
}
```

Response:
```json
{
    "message": "User Created successfully"
}
```

#### POST `/login`
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

### Members
#### GET `/members`
Headers:
```makefile
Authorization: Bearer <access_token>
```

Response:
```json
[
    {"id": 1, "name": "Tom", "email": "tom@example.com"}
]
```

#### POST `/members`
Request:
```json
{
    "name": "Mary",
    "email": "mary@example.com",
    "password": "secret123"
}
```
Response:
```json
{
    "message": "Member created successfully"
}
```

## Testing.

### Backend
```bash
cd Backend
pytest
```
### Frontend
```bash
To be implemented
```

## How to contribute to this project.
Contributions are welcomed!
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

#### 6. Open a pull request

### Visual Contribution Work flow
<p align="center">
    <!-- [Workflow](./static/images/contribution_work_flow.png) -->
    <img src="./static/images/contribution_work_flow.png" alt="Work Flow">
</p>

### Tips for good Pull Request
- Break big changes into smaller PRs.

- Provide screenshots or examples if it’s a UI change.

- Reference issues if applicable: `Fixes #issue-number`.

- Keep your branch up to date with the main repo:
```bash
git remote add upstream https://github.com/<original-owner>/<repo-name>.git
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## License

Distributed under the MIT License.

### Ready to manage your club smarter? Welcome to Club IQ!
#### Happy Coding