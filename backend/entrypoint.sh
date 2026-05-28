#!/bin/bash
set -e

echo "Waiting for PostgreSQL to start..."
until pg_isready -h postgres -p 5432 -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "PostgreSQL not ready yet, retrying in 2s..."
  sleep 2
done
echo "PostgreSQL started!"

export PYTHONPATH=/app

# Set up database migrations
echo "Running database migrations..."
flask db upgrade || true

# Start the Flask development server
echo "Starting Flask development server..."
exec gunicorn -c gunicorn_config.py wsgi:app
