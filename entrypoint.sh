#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Wait for the database to be ready.
echo "--- Checking for database availability ---"
python /app/wait_for_db.py

# Apply database migrations
echo "--- Applying database migrations ---"
python manage.py migrate

# Collect static files
echo "--- Collecting static files ---"
python manage.py collectstatic --no-input

echo "--- Starting Gunicorn server ---"
exec "$@"