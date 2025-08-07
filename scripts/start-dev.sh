#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting development environment...${NC}"

# Check if Supabase is already running
if ! supabase status > /dev/null 2>&1; then
    echo -e "${YELLOW}Starting Supabase...${NC}"
    supabase start
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Supabase started successfully!${NC}"
    else
        echo -e "${RED}Failed to start Supabase. Exiting...${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}Supabase is already running!${NC}"
fi

# Start the development servers
echo -e "${YELLOW}Starting development servers...${NC}"
turbo run dev
