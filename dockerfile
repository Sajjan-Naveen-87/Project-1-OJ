#Stage 1: Build frontend
FROM node:18 AS build-stage

WORKDIR /app
COPY ./frontend/package*.json/ /app/frontend/
WORKDIR /app/frontend/
#nstalling dependencies
RUN npm install

#buliding the frontend
RUN npm run build

#Stage 2: Build Backend
FROM python:3.11.0 

# Set the environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app
COPY ./backend/ /app/backend/
RUN pip install --upgrade pip
RUN pip install -r ./backend/requirements.txt

#Copying the frontend build to the backend static files
COPY --from=build-stage ./app/frontend/build /app/backend/bubbleCode/static/
COPY --from=build-stage ./app/frontend/build/static /app/backend/bubbleCode/static/
COPY --from=build-stage ./app/frontend/build/static/index.html /app/backend/bubbleCode/templates/index.html

#Running the Django migrations
RUN python ./backend/manage.py migrate

#Running the Django collectstatic command
RUN python ./backend/manage.py collectstatic --no-input

#Expose the port
EXPOSE 80

WORKDIR /app/backend/
#Start the Django server
CMD ["gunicorn", "bubbleCode.wsgi:application", "--bind", "0.0.0.0:80"]
#
