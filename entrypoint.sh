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
python manage.py collectstatic --noinput --clear 

# This is crucial for fixing permissions on the mounted volume for media files.
# It ensures the 'app' user can write to it, preventing crashes on file uploads.
chown -R app:app /app/media

echo "--- Starting Gunicorn server ---"
# Use gosu to drop privileges and execute the main command (gunicorn) as the 'app' user.
# Check if gosu is available, if not fall back to running as current user
if command -v gosu >/dev/null 2>&1; then
    exec gosu app "$@" --bind 0.0.0.0:8000 --workers 4 --timeout 90
else
    echo "Warning: gosu not found, running as current user"
    exec "$@" --bind 0.0.0.0:8000 --workers 4 --timeout 90
fi

