#!/bin/bash

echo "--- Starting database migration script ---"

# Ensure DIRECT_URL is populated
if [ -z "$DIRECT_URL" ]; then
  echo "DIRECT_URL is empty. Attempting to read from Render env..."
  DIRECT_URL_ENV=$(printenv DIRECT_URL)

  if [ -z "$DIRECT_URL_ENV" ]; then
    echo "Error: DIRECT_URL is still empty after printenv fallback."
    exit 1
  fi

  export DIRECT_URL="$DIRECT_URL_ENV"
fi

echo "DIRECT_URL is: $DIRECT_URL"

# Set DATABASE_URL for Prisma
export DATABASE_URL="$DIRECT_URL"
echo "DATABASE_URL set to: $DATABASE_URL"

# Final check before running migration
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  exit 1
fi

echo "Running Prisma Migrate Deploy..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "--- Prisma Migrate Deploy completed successfully ---"
else
  echo "--- Prisma Migrate Deploy FAILED ---"
  exit 1
fi

echo "--- Database migration script finished ---"
