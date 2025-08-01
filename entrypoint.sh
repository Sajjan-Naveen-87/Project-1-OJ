#!/bin/sh

# This script is run when the container starts.
# It ensures the database is ready, applies migrations, and collects static files
# before starting the main application server.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Applying database migrations..."
python manage.py migrate

echo "Starting Gunicorn server..."
# Execute the command passed into this script (the Dockerfile's CMD)
exec "$@"