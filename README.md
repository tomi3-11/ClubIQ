# Club IQ

<p align='center'>
<img src="https://img.shields.io/badge/Python-3.10+-blue?logo=python" alt="Python">
<img src="https://img.shields.io/badge/Flask-Backend-black?logo=flask" alt="Flask">
<img src="https://img.shields.io/badge/React-Frontend-61dafb?logo=react" src="React">
<img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

## Project Description
Club IQ is a modern full-stack web application for managing club activities, members, and events.
It provides a Flask REST API backend and a React + Vite frontend, with JWT authentication and role-based access in the roadmap.

This project is a great example of building a production-ready full-stack app with clear separation between backend and frontend.

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
- Roadmap: Event scheduling, notifications, role-based access

## Tech Stack

- __Backend__: Python, Flask, SQLite/PostgreSQL
- __Frontend__: React, Vite, Axios, TailwindCSS
- __Authentication__: JWT
- __Deployment__: Docker, Render, Vercel (TBD)


## Project set up & Installation
```bash
# Backend
cd Backend

# Create a virtual environment
python -m venv venv
# Activate
source venv/bin/activate # On Linux / Mac
venv\scripts\activate # Windows
# Install dependencies
pip install -r requirements.txt
flask run

# Frontend
cd Frontend
npm install
npm run dev

```

## API Reference
### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://yourdomain.com/api`

#### Authentication
### POST `/auth/login`
Request:
```json
{
    "email": "user@gmail.com",
    "password": "mypassword"
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

## Tesiing.
To be implemented

### Backend
### Frontend

## Contributing
Contributions are welcomed!
1. Fork the repo
2. Create a feature branch:
```bash
git checkout -b feature-name
```
3. Commit your changes:
```bash
git commit -m "Added feature"
```
4. Push to the branch:
```bash
git push origin feature-name
```
5. Open a pull request

## License

Distributed under the MIT License.

#### Happy Coding