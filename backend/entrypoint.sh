#!/bin/sh

echo "Waiting for database..."

python -c "
import os
import socket
import time
from urllib.parse import urlparse

db_url = os.getenv('DATABASE_URL', 'postgresql://postgres:root@db:5432/tnp_portal')
parsed = urlparse(db_url)

if parsed.scheme == 'sqlite' or 'sqlite' in db_url:
    print('SQLite database detected. Skipping network connection check.')
else:
    host = parsed.hostname or 'db'
    port = parsed.port or 5432
    print(f'Checking connection to database at {host}:{port}...')
    while True:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(2.0)
                s.connect((host, int(port)))
                print('Database is ready!')
                break
        except (socket.error, socket.timeout) as e:
            print(f'Database not ready yet ({e}). Waiting...')
            time.sleep(1)
"

echo "Running migrations..."
alembic upgrade head

echo "Seeding database..."
python -m app.seed

echo "Starting backend server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
