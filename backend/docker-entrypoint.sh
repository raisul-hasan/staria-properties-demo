#!/bin/sh
set -e

echo "==> Running Database Migrations..."
npx prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "==> Seeding Database..."
  node dist/prisma/seed.js
fi

echo "==> Starting Production Backend Application..."
exec "$@"
