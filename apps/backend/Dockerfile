FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY apps/backend/dist ./apps/backend/dist
COPY apps/backend/package.json ./apps/backend/

# Copy database package files (add these lines)
COPY packages/database/dist ./packages/database/dist
COPY packages/database/package.json ./packages/database/

# If your database package needs the Prisma client, also copy the Prisma directory
COPY packages/database/app/prisma ./packages/database/app/prisma

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable && corepack prepare pnpm@9.14.1 --activate

# Install only production deps
RUN pnpm install --prod

EXPOSE 4040
CMD ["node", "apps/backend/dist/index.js"]