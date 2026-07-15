#!/bin/sh
set -e

echo "Running database migrations..."
bun --bun drizzle-kit migrate

echo "Starting API..."
exec bun run src/index.ts
