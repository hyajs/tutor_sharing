#!/bin/bash
set -e

# Configuration
REGISTRY="crpi-9nya4llb97sx949i.cn-hangzhou.personal.cr.aliyuncs.com"
BACKEND_IMAGE="$REGISTRY/hyajs/jiajiao-backend"
FRONTEND_IMAGE="$REGISTRY/hyajs/jiajiao-frontend"
REPO_URL="https://github.com/hyajs/tutor_sharing.git"
PROJECT_DIR="/root/projects/jiajiao"

TAG=${TAG:-latest}
NETWORK=jiajiao-net

echo "=== Deployment started at $(date) ==="
echo "Tag: $TAG"

# Create project directory and clone if not exists
if [ ! -d "$PROJECT_DIR/.git" ]; then
    echo "Cloning repository..."
    mkdir -p $PROJECT_DIR
    git clone $REPO_URL $PROJECT_DIR
fi

cd $PROJECT_DIR
git pull origin main

# Create network if not exists
docker network rm $NETWORK 2>/dev/null || true
docker network create $NETWORK

# Stop and remove old containers
echo "Stopping old containers..."
docker stop jiajiao-nginx jiajiao-frontend jiajiao-backend jiajiao-postgres jiajiao-redis 2>/dev/null || true
docker rm jiajiao-nginx jiajiao-frontend jiajiao-backend jiajiao-postgres jiajiao-redis 2>/dev/null || true

# Login to ACR
echo "Logging in to ACR..."
echo "$ACR_PASSWORD" | docker login $REGISTRY --username $ACR_USERNAME --password-stdin

# Pull images
echo "Pulling images..."
docker pull $BACKEND_IMAGE:$TAG
docker pull $FRONTEND_IMAGE:$TAG

# Tag images locally
docker tag $BACKEND_IMAGE:$TAG jiajiao-backend:latest
docker tag $FRONTEND_IMAGE:$TAG jiajiao-frontend:latest

# Pull PostgreSQL and Redis if not exists
docker pull postgres:15-alpine
docker pull redis:7-alpine

# Run PostgreSQL
echo "Starting PostgreSQL..."
docker run -d \
  --name jiajiao-postgres \
  --restart=always \
  --network $NETWORK \
  -e POSTGRES_USER=jiajiao \
  -e POSTGRES_PASSWORD=jiajiao123 \
  -e POSTGRES_DB=jiajiao \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Run Redis
echo "Starting Redis..."
docker run -d \
  --name jiajiao-redis \
  --restart=always \
  --network $NETWORK \
  redis:7-alpine

# Run Backend
echo "Starting Backend..."
docker run -d \
  --name jiajiao-backend \
  --restart=always \
  --network $NETWORK \
  -p 8001:8000 \
  -e DATABASE_URL=postgresql://jiajiao:jiajiao123@jiajiao-postgres:5432/jiajiao \
  -e REDIS_URL=redis://jiajiao-redis:6379/0 \
  -e SECRET_KEY=your-secret-key-change-in-production \
  -e JWT_SECRET_KEY=your-jwt-secret-key-change-in-production \
  -v $PROJECT_DIR/data:/app/data \
  jiajiao-backend:latest

# Run Frontend
echo "Starting Frontend..."
docker run -d \
  --name jiajiao-frontend \
  --restart=always \
  --network $NETWORK \
  jiajiao-frontend:latest

# Run Nginx
echo "Starting Nginx..."
docker run -d \
  --name jiajiao-nginx \
  --restart=always \
  --network $NETWORK \
  -p 81:80 \
  -v $PROJECT_DIR/docker/nginx.conf:/etc/nginx/conf.d/default.conf \
  nginx:alpine

# Cleanup
echo "Cleaning up..."
docker image prune -f

echo "=== Deployment completed at $(date) ==="

# Show status
echo ""
echo "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"