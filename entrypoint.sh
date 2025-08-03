#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e 

# Wait for the database to be ready.
echo "--- Checking for database availability ---"
python /app/wait_for_db.py 

# Apply database migrations
echo "--- Applying database migrations ---"
python manage.py migrate 

# The 'collectstatic' command is now run during the Docker build process
# to improve container startup speed.

echo "--- Starting Gunicorn server ---"
# Execute the main command (gunicorn) directly since we're already running as the 'app' user
# Add workers and timeout configuration
exec gunicorn bubbleCode.wsgi:application --bind 0.0.0.0:8000 --workers 4 --timeout 90
