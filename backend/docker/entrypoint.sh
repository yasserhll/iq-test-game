#!/bin/bash
set -e

# Ensure SQLite data directory exists (on volume /data)
if [ "$DB_CONNECTION" = "sqlite" ]; then
  mkdir -p "$(dirname "${DB_DATABASE:-/var/www/html/database/database.sqlite}")"
  touch "${DB_DATABASE:-/var/www/html/database/database.sqlite}"
  chown www-data:www-data "${DB_DATABASE:-/var/www/html/database/database.sqlite}"
fi

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
