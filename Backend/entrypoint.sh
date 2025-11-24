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
exec flask run --host=0.0.0.0 --port=5000
