# **Club IQ**

<p align='center'>
<img src="https://img.shields.io/badge/Python-3.10+-blue?logo=python">
<img src="https://img.shields.io/badge/Flask-Backend-black?logo=flask">
<img src="https://img.shields.io/badge/Next.js-Frontend-black?logo=nextdotjs">
<img src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql">
<img src="https://img.shields.io/badge/License-MIT-green">
</p>

---

# **Overview**

**Club IQ** is a full-stack platform for managing clubs: members, events, attendance, authentication, and more.

It includes:

* ✅ **Flask REST API**
* ✅ **Next.js frontend**
* ✅ **PostgreSQL** relational DB
* ✅ Full Docker environment
* ✅ Scalable architecture for real-world clubs and organizations

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
│── Backend/
│   ├── app/
│   ├── instance/
│   ├── Config.py
│   ├── requirements.txt
│
│── Frontend/
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

Works on **Windows**, **WSL**, and **Linux**.
Follow the steps as listed — skipping ahead is how people summon bugs from the abyss.

---

# ✅ **STEP 1 — Install Docker Desktop**

Download: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

During installation:

* ✅ Enable Hyper-V / Virtualization
* ✅ Enable WSL2 backend

If Docker isn’t running, nothing else will.

---

# ✅ **STEP 2 — (Recommended) Setup Node in WSL using NVM**

On Windows, use **WSL** for Node development or you’ll meet npm’s mood swings.

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

### Verify WSL paths

```bash
which node
which npm
node -v
npm -v
```

Paths must **not** point to Windows directories.

---

# ✅ **STEP 3 — Install Make (Windows only)**

If you're developing outside WSL:

Download GNU Make: [https://gnuwin32.sourceforge.net/downlinks/make.php](https://gnuwin32.sourceforge.net/downlinks/make.php)

Add to PATH, then verify:

```bash
make help
```

---

# ✅ **STEP 4 — Using the Makefile**

The Makefile wraps common Docker commands.

### Build all services

```bash
make build
```

### Run containers (attached)

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

### Enter containers

```bash
make front
make back
```

### Clean up

```bash
make clean
```

---

# ✅ **Backend Setup**

```bash
cd Backend

python -m venv venv

# Activate:
source venv/bin/activate      # Linux/macOS/WSL
venv\Scripts\activate         # Windows

pip install -r requirements.txt

flask run
```

Environment variables live in `instance/.env`.

---

# ✅ **Frontend Setup (Next.js)**

```bash
cd Frontend

npm install
npm run dev
```

Frontend runs on:

[http://localhost:3000](http://localhost:3000)

---

# **API Reference**

### Base URLs

* Dev: `http://localhost:5000/api`
* Prod: `https://yourdomain.com/api`

---

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

---

### Members Example

**GET** `/members`
Headers:

```
Authorization: Bearer <token>
```

Response:

```json
[
  { "id": 1, "name": "Tom", "email": "tom@example.com" }
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

The workflow is centered around **cloning main first**.
---

## ✅ **Developer Workflow (Contributor-First)**

### **1. Clone the repository**

```bash
git clone https://github.com/USIU-ClubIQ/ClubIQ.git
cd ClubIQ
```

### **2. Switch to main and pull latest**

```bash
git checkout main
git pull origin main
```

### **3. Create a feature branch**

```bash
git checkout -b feature/<task-name>
```

### **4. Work → Commit → Push**

```bash
git add .
git commit -m "Implement <feature>"
git push origin feature/<task-name>
```

### **5. Open a Pull Request**

* PR from your `feature/<task-name>` → `main`
* Add a short description
* Assign team lead

---

# **License**

MIT License.