#!/bin/bash
export DATABASE_URL="$DIRECT_URL"
npx prisma migrate deploy