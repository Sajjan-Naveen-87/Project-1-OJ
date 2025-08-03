# Stage 1: Build Frontend
# Use a specific -alpine image for a smaller size and better security
FROM node:18-alpine AS build-stage

# Set working directory for the frontend build
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY ./frontend/package*.json ./

# Installing dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY ./frontend/ ./

# Building the frontend
RUN npm run build


# Stage 2: Build and Run Backend
# Use a -slim image for a smaller final image
FROM python:3.11.0-slim

# Set the environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create a non-root user to run the application for better security
RUN addgroup --system app && adduser --system --group app

WORKDIR /app

COPY ./backend/requirements.txt .

# Install system dependencies (gosu, build tools) and Python packages in a single RUN command.
# This optimizes the Docker build by reducing layers. Then, clean up build tools to keep the final image small.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gosu \
        pkg-config \
        gcc \
        default-libmysqlclient-dev && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get purge -y --auto-remove gcc default-libmysqlclient-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Copy the backend application code
COPY ./backend/ .

# Copying the frontend build artifacts to where Django can find them
# First, create the directories if they don't exist
RUN mkdir -p ./bubbleCode/static/assets ./bubbleCode/templates

# Copy the built frontend files
COPY --from=build-stage /app/build/assets ./bubbleCode/static/assets
COPY --from=build-stage /app/build/.vite/manifest.json ./bubbleCode/static/
COPY --from=build-stage /app/build/index.html ./bubbleCode/templates/index.html

# Also copy the public images directory
COPY ./frontend/public/Images ./bubbleCode/static/Images

# Collect static files during the build to improve startup time.
# Dummy environment variables are provided so Django settings can be loaded without error.
# The database is not actually needed for this step.
RUN SECRET_KEY=dummy-secret-for-build \
    MYSQL_DB=dummy \
    MYSQL_USER=dummy \
    MYSQL_PASSWORD=dummy \
    MYSQL_HOST=localhost \
    MYSQL_PORT=3306 \
    python manage.py collectstatic --noinput --clear

# Copy the wait-for-db script
COPY ./wait_for_db.py /app/wait_for_db.py

# Copy the entrypoint script into the container
COPY ./entrypoint.sh /app/entrypoint.sh

# Create media directory, change ownership of all files to the app user, and make the script executable
# This now includes the 'staticfiles' directory created by collectstatic.
RUN mkdir -p /app/media && \
    chown -R app:app /app && \
    chmod +x /app/entrypoint.sh

# Switch to the non-root user
USER app

# Expose the port the app runs on
EXPOSE 8000

# Set the entrypoint to run startup tasks
ENTRYPOINT ["/app/entrypoint.sh"]
