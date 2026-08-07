#!/bin/bash
set -e

echo "Restoring the database for the project"

CONTAINER_CMD=podman

$CONTAINER_CMD exec -i messaging-app-postgres-dev \
    psql -U user -d authentication -W password < ./init.sql

echo "Database restoration successful"