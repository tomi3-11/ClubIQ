#!/bin/bash
set -e

echo "Waiting for PostgreSQL to start..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL started!"

export PYTHONPATH=/app

# Set up database migrations
echo "Running database migrations..."
flask db upgrade || true

# Start the Flask development server
echo "Starting Flask development server..."
exec gunicorn -c gunicorn_config.py wsgi:app
