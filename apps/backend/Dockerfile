FROM node:18-alpine

WORKDIR /app

COPY apps/backend/dist ./apps/backend/dist
COPY apps/backend/package.json ./apps/backend/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable && corepack prepare pnpm@9.14.1 --activate

# Install only production deps
RUN pnpm install --prod

EXPOSE 4040
CMD ["node", "apps/backend/dist/index.js"]
