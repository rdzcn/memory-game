FROM node:18-alpine

WORKDIR /app

COPY apps/backend/dist ./apps/backend/dist
COPY apps/backend/package.json ./apps/backend/

# Copy database package files
COPY packages/database/dist ./packages/database/dist
COPY packages/database/package.json ./packages/database/
COPY packages/database/app/prisma ./packages/database/app/prisma
COPY packages/common/dist ./packages/common/dist
COPY packages/common/package.json ./packages/common/

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable && corepack prepare pnpm@9.14.1 --activate

# Install only production deps
RUN pnpm install --prod

# Add this line to generate the Prisma client
RUN npx prisma generate --schema=./packages/database/app/prisma/schema.prisma

EXPOSE 4040
CMD ["node", "apps/backend/dist/index.js"]