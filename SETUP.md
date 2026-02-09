# TNP Portal – Setup Guide

## Requirements
- Python 3.10 / 3.11
- PostgreSQL 14+
- Node.js (optional frontend)
- Git

---

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

## Database Setup

```bash
CREATE DATABASE tnp_portal;

alembic upgrade head
```

## Seed Database

```bash
python -m app.seed
```

## Run Backend

```bash
uvicorn app.main:app --reload
```
