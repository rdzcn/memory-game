# Use a smaller image with optional dependency support
FROM node:18-alpine

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9.14.1 --activate

# Set working directory to monorepo root
WORKDIR /app

# Copy everything (monorepo layout must stay intact)
COPY . .

# Install all deps in the workspace
RUN pnpm install --frozen-lockfile

# Build only the backend (resolves internal deps like @memory-game/database)
RUN pnpm build --filter @memory-game/backend...

# Expose backend port
EXPOSE 4040

# Run backend
CMD ["node", "apps/backend/dist/index.js"]

