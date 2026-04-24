#!/bin/sh
set -eu

BACKEND_PORT="${BACKEND_PORT:-5000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
RUN_MIGRATIONS="${RUN_MIGRATIONS:-false}"
WAIT_FOR_DB="${WAIT_FOR_DB:-$RUN_MIGRATIONS}"

if [ "$WAIT_FOR_DB" = "true" ]; then
  node /app/docker/wait-for-postgres.js
fi

if [ "$RUN_MIGRATIONS" = "true" ]; then
  (
    cd /app/backend
    node ../node_modules/typeorm/cli.js migration:run \
      -d dist/shared/infrastructure/persistence/typeorm/typeorm.datasource.js
  )
fi

shutdown() {
  kill -TERM "$backend_pid" "$frontend_pid" 2>/dev/null || true
  wait "$backend_pid" "$frontend_pid" 2>/dev/null || true
}

trap shutdown INT TERM

(
  cd /app/backend
  PORT="$BACKEND_PORT" node dist/main.js
) &
backend_pid="$!"

(
  cd /app/frontend/frontend
  PORT="$FRONTEND_PORT" HOSTNAME="0.0.0.0" node server.js
) &
frontend_pid="$!"

while :; do
  if ! kill -0 "$backend_pid" 2>/dev/null; then
    wait "$backend_pid" || status="$?"
    kill -TERM "$frontend_pid" 2>/dev/null || true
    exit "${status:-1}"
  fi

  if ! kill -0 "$frontend_pid" 2>/dev/null; then
    wait "$frontend_pid" || status="$?"
    kill -TERM "$backend_pid" 2>/dev/null || true
    exit "${status:-1}"
  fi

  sleep 2
done
