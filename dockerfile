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

# Copy requirements and install Python dependencies first to leverage caching
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the backend application code
COPY ./backend/ .

# Copying the frontend build artifacts to where Django can find them
COPY --from=build-stage /app/dist/index.html ./bubbleCode/templates/index.html
COPY --from=build-stage /app/dist/assets ./bubbleCode/static/assets

# Copy the wait-for-db script
COPY ./wait_for_db.py /app/wait_for_db.py

# Copy the entrypoint script into the container
COPY ./entrypoint.sh /app/entrypoint.sh

# Change ownership of all files to the app user and make the script executable
RUN chown -R app:app /app && chmod +x /app/entrypoint.sh

# Switch to the non-root user
USER app

# Expose the port the app runs on
EXPOSE 80

# Set the entrypoint to run startup tasks
ENTRYPOINT ["/app/entrypoint.sh"]

# Start the Django server using gunicorn
CMD ["gunicorn", "bubbleCode.wsgi:application", "--bind", "0.0.0.0:8000"]
