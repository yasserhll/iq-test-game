#!/bin/bash
set -e

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

# Cache config/routes for production
php artisan config:cache
php artisan route:cache

# Run migrations
php artisan migrate --force

# Start Apache
exec apache2-foreground
