#!/bin/bash

echo "--- Starting database migration script ---"

# Check if DIRECT_URL is set
if [ -z "$DIRECT_URL" ]; then
  echo "Error: DIRECT_URL environment variable is not set."
  exit 1
fi

echo "DIRECT_URL is: $DIRECT_URL"

# Set DATABASE_URL to DIRECT_URL for migrations
export DATABASE_URL="$DIRECT_URL"
echo "DATABASE_URL set to: $DATABASE_URL"

# Check if DATABASE_URL is set (after export)
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set after export."
  exit 1
fi

echo "Running Prisma Migrate Deploy..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "--- Prisma Migrate Deploy completed successfully ---"
else
  echo "--- Prisma Migrate Deploy FAILED ---"
  exit 1 # Exit with a non-zero status code if migration fails
fi

echo "--- Database migration script finished ---"