# BubbleCode - Coding Platform

## Overview
BubbleCode is a comprehensive coding platform with a React frontend and Django backend, featuring coding problems, an AI chatbot, a code compiler, and a leaderboard system.

## Architecture
- **Frontend**: React with Vite
- **Backend**: Django with Django REST Framework
- **Database**: MySQL
- **Deployment**: Docker container on AWS EC2

## Prerequisites
- Docker and Docker Compose
- MySQL database (AWS RDS or local)
- Docker Hub account

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the `backend/` directory with the following variables:
```env
SECRET_KEY=your-secret-key-here
DEBUG=False
MYSQL_DB=your_database_name
MYSQL_USER=your_database_user
MYSQL_PASSWORD=your_database_password
MYSQL_HOST=your_database_host
MYSQL_PORT=3306
```

### 2. Docker Build
```bash
docker build -t bubblecode-backend:latest .
```

### 3. Run with Docker
```bash
docker run -d --name bubblecode-backend -p 80:8000 --env-file ./backend/.env bubblecode-backend:latest
```

## CI/CD Pipeline
The project uses GitHub Actions for continuous deployment to AWS EC2:

1. On push to master branch
2. Docker image is built and pushed to Docker Hub
3. SSH connection to EC2 instance
4. Docker container is updated with latest image

## AWS Deployment

### EC2 Setup
1. Launch an Ubuntu EC2 instance
2. Install Docker:
   ```bash
   sudo apt update
   sudo apt install docker.io
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

### Environment Setup
1. Copy `.env` file to EC2 instance:
   ```bash
   scp ./backend/.env ubuntu@your-ec2-ip:/home/ubuntu/bubbleCode/.env
   ```

2. Create directory structure:
   ```bash
   mkdir -p /home/ubuntu/bubbleCode
   ```

## Deployment Process
The deployment is automated through GitHub Actions. To manually deploy:

```bash
# Pull latest image
docker pull your-dockerhub-username/bubblecode-backend:latest

# Stop and remove existing container
docker stop bubblecode-backend || true
docker rm bubblecode-backend || true

# Run new container
docker run -d --name bubblecode-backend -p 80:8000 --env-file /home/ubuntu/bubbleCode/.env your-dockerhub-username/bubblecode-backend:latest
```

## Troubleshooting

### Port Issues
If you encounter port binding issues:
```bash
sudo systemctl stop apache2 || true
sudo systemctl stop nginx || true
sudo systemctl restart docker
```

### Database Connection
Ensure your MySQL database is accessible from the EC2 instance and credentials are correct in the `.env` file.

## API Endpoints
- `/api/v1/accounts/` - User authentication and management
- `/api/v1/problem_set/` - Coding problems
- `/api/v1/compiler/` - Code compilation
- `/api/v1/leaderboard/` - Leaderboard system
- `/api/v1/ai/` - AI chatbot

## Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
