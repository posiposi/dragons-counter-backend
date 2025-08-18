#!/bin/sh
set -e

if [ -f .env.test ]; then
    export $(cat .env.test | grep -v '^#' | xargs)
fi

echo "Initializing test database..."
npx prisma db push --skip-generate

echo "Test database initialized successfully"