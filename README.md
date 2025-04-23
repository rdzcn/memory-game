# Memory Game Club 🧠🕹️  
A real-time multiplayer memory card game built with full-stack TypeScript.  
Play now: [https://memorygameclub.com](https://memorygameclub.com)

## 🎯 Overview

Memory Game Club is a real-time web game where players compete by flipping cards and matching pairs. Built from scratch with a modern full-stack architecture, it features live multiplayer gameplay powered by WebSockets, persistent game history, and smooth deployments using GitHub Actions and Docker.

## 🧩 Features

- 🧠 Real-time multiplayer memory card gameplay
- 🧪 Local state management with synced scoring over WebSockets
- 🎯 Score tracking, match logic, and game state persistence
- 🔒 Secure, minimal, self-hosted infrastructure
- 🚀 Fully automated CI/CD pipeline via GitHub Actions + SSH
- 🐳 Dockerized backend and custom Linux VPS server setup
- 🌐 Domain setup + HTTPS via Netcup

## ⚙️ Tech Stack

### Frontend
- **NextJs** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Socket.IO client**
- **ShadCN UI**
- **Biome**

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Socket.IO server**
- **Prisma** + **Postgres** (on Supabse)
- **Redis** (for temporary in-memory game state) // in Progress

### Infra & DevOps
- **Monorepo** with `pnpm` workspaces
- **Turbo** for incremental builds
- **GitHub Actions** for CI/CD
- **Docker** for containerization
- **Netcup VPS** with Linux, Nginx, SSH deploys

## 🏗️ Architecture

```bash
realtime-memory-game/
├── apps/
│   └── backend/            # Express app, game logic, WebSocket handlers
│   ├── client/             # NextJs frontend
├── packages/
│   ├── common/             # Shared TypeScript types & utils
│   └── database/           # Prisma setup, schema, migrations
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## Local development

```bash
### Install dependencies
pnpm install

### Build backend & frontend
pnpm build

### Run backend (with watch)
pnpm --filter @memory-game/backend dev

### Run frontend
pnpm --filter @memory-game/client dev

### Or simply together with
pnpm dev

