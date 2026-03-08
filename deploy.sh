#!/bin/bash
set -e

# Boo Deploy Script
# Usage: ./deploy.sh [production|staging|dev]

ENV=${1:-production}
SERVER="root@165.22.96.128"
APP_DIR="/opt/boo"

echo "==> Deploying Boo ($ENV) to $SERVER"

# 1. SSH and pull + rebuild on server
ssh $SERVER << 'REMOTE'
set -e
APP_DIR="/opt/boo"

# First deploy: clone repo
if [ ! -d "$APP_DIR" ]; then
  echo "==> Cloning repo..."
  git clone git@github.com:junixlabs/boo.git $APP_DIR
  cd $APP_DIR

  # Copy env templates
  cp .env.example .env
  cp api/.env.production api/.env
  echo "==> IMPORTANT: Edit $APP_DIR/.env and $APP_DIR/api/.env with real credentials before running deploy again!"
  exit 0
fi

cd $APP_DIR

# Pull latest
echo "==> Pulling latest..."
git pull

# Build and restart
echo "==> Building containers..."
docker compose build --no-cache

echo "==> Starting containers..."
docker compose up -d

# Run migrations
echo "==> Running migrations..."
docker compose exec api php artisan migrate --force

# Clear caches
echo "==> Clearing caches..."
docker compose exec api php artisan config:cache
docker compose exec api php artisan route:cache
docker compose exec api php artisan view:cache

echo "==> Deploy complete!"
docker compose ps
REMOTE
