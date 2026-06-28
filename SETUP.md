# TNP Portal – Setup Guide

## Requirements

### For Docker Setup (Recommended)
- [Docker](https://docs.docker.com/get-docker/) 20+
- [Docker Compose](https://docs.docker.com/compose/install/) v2+

### For Manual Setup
- Python 3.10 / 3.11
- PostgreSQL 14+
- Node.js 18+
- Git

---

## 🐳 Docker Setup (Recommended)

This is the easiest way to run the entire stack (PostgreSQL + Backend + Frontend) with a single command.

### 1. Clone the repository

```bash
git clone <repo-url>
cd tnp-portal
```

### 2. Configure environment variables

Copy the example env file and fill in your secrets:

```bash
cp .env.example backend/.env
```

Edit `backend/.env` and set the required values:

```env
SECRET_KEY=your-secure-random-secret-key
GROQ_API_KEY=your-groq-api-key
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=tnp@college.edu
```

> **Note:** `DATABASE_URL` and `CORS_ORIGINS` are automatically overridden by `docker-compose.yml` — you don't need to change them for Docker.

### 3. Build and start all services

```bash
docker compose up --build
```

This single command will:
- 🗄️ Start a **PostgreSQL 15** database
- ⚙️ Build and start the **FastAPI backend** (auto-runs migrations + seeds DB)
- 🌐 Build and start the **React frontend** served via Nginx

### 4. Access the application

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000       |
| Backend API | http://localhost:8000    |
| API Docs | http://localhost:8000/docs  |

### Useful Docker commands

```bash
# Run in detached (background) mode
docker compose up --build -d

# View logs for all services
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend

# Stop all services
docker compose down

# Stop and remove volumes (wipes the database)
docker compose down -v

# Rebuild a single service
docker compose up --build backend
```

---

## 🛠️ Manual Setup

Use this if you prefer running services directly without Docker.

### Backend Setup

```bash
cd backend
python -m venv .venv

# Activate virtual environment
# Linux/macOS:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

pip install -r requirements.txt
```

### Database Setup

Create the PostgreSQL database, then run migrations:

```bash
CREATE DATABASE tnp_portal;
```

```bash
alembic upgrade head
```

### Seed Database

```bash
python -m app.seed
```

### Run Backend

```bash
uvicorn app.main:app --reload
```

---

### Frontend Setup

Ensure you have Node.js installed.

```bash
cd frontend
npm install
```

### Run Frontend

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.
