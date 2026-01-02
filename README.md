# **Club IQ**

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



---

# **Overview**

**Club IQS** is a full-stack platform for managing clubs: members, events, attendance, authentication, and more.

It includes:

* **Flask REST API**
* **Next.js frontend**
* **PostgreSQL** relational DB
* Full **Docker** environment
* **Clerk** authentication
* **Scalable architecture** for real-world clubs and organizations

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
│── docker-compose.yml
│── Makefile
│── README.md
│── .gitignore
```

---

# **Setup & Installation**

Works on **Windows**, and **Linux**.
Follow the steps as listed — skipping ahead is how people summon bugs from the abyss.

---

# ✅ **Step 1 — Install Docker**
We recommend installing **Docker Desktop** as it not only installs Docker Desktop but also the **Docker Engine, Docker CLI, and Docker Compose.**

Download: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

During installation:

* Enable **Hyper-V / Virtualization**
* Enable **WSL2** backend

After installation, make sure the **Docker Daemon / docker.service** is running in the background otherwise **none** of the make or docker commands will work.

**Note: Using Docker Desktop / Podman Desktop is completely optional but is recommended since it makes it easy to manage your containers.**

---

# ✅ **Step 2 — (Recommended) Setup Node in WSL using NVM**

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

# ✅ **Step 3 — Install Make**

The Makefile wraps common Docker commands. The utility is part of **GnuMake** so don't get alarmed if you don't see make by itself.

## Windows

Download and install the make utility from: [SourceForge](https://sourceforge.net/projects/gnuwin32/files/make/3.81/make-3.81.exe/download?use_mirror=yer&download)

Add to PATH, then verify:

```bash
make --version
```

## Linux / macOS

Install the make utility via your distro's package manager. For instance:

* macOS:

```bash
brew install make
```

* Debian / Ubuntu:

```bash
sudo apt install make
```

* Fedora:

```bash
sudo dnf install make
```

* Arch Linux:

```bash
sudo pacman -S make
```

* NixOS:

```bash
sudo nix.env -iA nixos.gnumake
```
---

# ✅ **Step 4 — Creating the Containers**

View the our [**Docker.md**](./Docker.md) file for the full installation steps.
### Build all services:

```bash
make build
```

### Run containers (attached):

```bash
make up
```

### Detached mode:

```bash
make up-detached
```

---

# ✅ **Manual Setup**

If you want to setup the project without using Docker:

```bash
cd Backend

python -m venv venv

# Activate:
source venv/bin/activate      # Linux/macOS
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

### Endpoint Documentation. All blueprints for backend

- [Authentication](./Backend/endpoint_documentation/authentication.md)
- [Clubs](./Backend/endpoint_documentation/clubs.md)
- [Members](./Backend/endpoint_documentation/members.md)
- [Activities](./Backend/endpoint_documentation/activities.md)
- [Rating](./Backend/endpoint_documentation/ratings.md)
- [Invitation](./Backend/endpoint_documentation/invitations.md)



# **Contribution Guide**

The workflow is centered around **cloning main first**.
---

## **Developer Workflow (Contributor-First)**

### **1. Fork the repository**
> **NOTE** : __Fork the repository then clone it from your side__. <br>
> For better practices, **DON'T** clone the repository directly from here...

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
