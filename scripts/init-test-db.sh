#!/bin/sh
set -e

echo "Initializing test database..."
DATABASE_URL="mysql://dragons_user:dragons_password@test-database:3306/dragons_counter_test" npx prisma db push --skip-generate

echo "Test database initialized successfully"