#!/bin/bash

# Navigate to the workspace root
cd ../..

# Run migrations
pnpm db:migrate:deploy

# Start the server
node apps/backend/dist/index.js