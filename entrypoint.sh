#!/bin/sh

# This script is run when the container starts.

# The 'exec "$@"' command will run the CMD from the Dockerfile.
# Before that, we can run some setup commands.

# It's a good practice to wait for the database to be ready.
# A more robust solution would use a tool like wait-for-it.sh or docker-compose's healthcheck.

echo "Applying database migrations..."
python manage.py migrate

# Now, execute the command passed to the script (the Dockerfile's CMD)
exec "$@"