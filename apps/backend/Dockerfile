FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy project files
COPY . .

# Install dependencies (workspace-aware)
RUN pnpm install --frozen-lockfile

# Build backend
RUN pnpm --filter @memory-game/backend build

# Expose backend port
EXPOSE 4040

# Run backend
CMD ["pnpm", "--filter", "@memory-game/backend", "start"]

