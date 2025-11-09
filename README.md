# **Club IQ**

<p align='center'>
<img src="https://img.shields.io/badge/Python-3.10+-blue?logo=python" alt="Python">
<img src="https://img.shields.io/badge/Flask-Backend-black?logo=flask" alt="Flask">
<img src="https://img.shields.io/badge/Next.js-Frontend-black?logo=nextdotjs" alt="Next.js">
<img src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql" alt="PostgreSQL">
<img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

---

# **Overview**

**Club IQ** is a modern full-stack platform for club management — handling members, events, attendance, authentication, and more.
The system is split into two clean components:

* ✅ **Flask REST API** backend
* ✅ **Next.js frontend**
* ✅ **PostgreSQL database** for strong relational structure
* ✅ Dockerized environment for consistent development
* ✅ Scalable architecture designed for real clubs and organizations

---

# **Table of Contents**

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
│── .gitignore
```

---

# **Setup & Installation**

This project supports **Windows**, **WSL**, and **Linux**.
Follow each step IN ORDER — or you’ll spend 3 hours debugging what should’ve taken 30 seconds.

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

```bash
cd Backend

python -m venv venv

# Activate
source venv/bin/activate          # Linux/macOS/WSL
venv\Scripts\activate             # Windows

pip install -r requirements.txt

flask run
```

Environment variables are managed via `.env` inside `instance/`.

---

# ✅ Frontend Setup (Next.js)

```bash
cd Frontend

npm install
npm run dev
```

Your UI lives at:
[http://localhost:3000](http://localhost:3000)

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

# **Testing**

### Backend

```bash
cd Backend
pytest
```

### Frontend

Coming soon.

---

# **Contribution Guide**

All contributors must follow the workflow below.

---

## ✅ **Developer Workflow**

### **1. Pull latest main**

```bash
git checkout main
git pull origin main
```

### **2. Create your feature branch**

```bash
git checkout -b feature/<task-name>
```

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