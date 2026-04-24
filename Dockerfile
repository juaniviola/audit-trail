# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps

WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN yarn install --frozen-lockfile

FROM deps AS builder

WORKDIR /app

COPY backend ./backend
COPY frontend ./frontend

ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir -p /app/frontend/public \
  && yarn --cwd backend build \
  && yarn --cwd frontend build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  BACKEND_PORT=5000 \
  FRONTEND_PORT=3000 \
  INTERNAL_API_URL=http://127.0.0.1:5000

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN yarn install --frozen-lockfile --production=true --ignore-scripts \
  && yarn cache clean

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/.next/standalone ./frontend
COPY --from=builder /app/frontend/.next/static ./frontend/frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/frontend/public

COPY docker ./docker

RUN chmod +x /app/docker/entrypoint.sh \
  && addgroup -S nodejs \
  && adduser -S audittrail -G nodejs \
  && chown -R audittrail:nodejs /app

USER audittrail

EXPOSE 3000 5000

ENTRYPOINT ["/app/docker/entrypoint.sh"]
