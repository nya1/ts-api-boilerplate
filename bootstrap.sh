#!/bin/bash

set -e

DATABASE_CONTAINER_NAME="test"

LOG_PREFIX=""

echo "$LOG_PREFIX Removing old $DATABASE_CONTAINER_NAME container..."

docker rm -f $DATABASE_CONTAINER_NAME &>/dev/null

echo "$LOG_PREFIX Starting $DATABASE_CONTAINER_NAME container..."

docker run --rm \
    --name $DATABASE_CONTAINER_NAME \
    -p 5432:5432 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=postgres_local \
    -d \
    postgres:14-alpine > /dev/null

# wait the container to startup
sleep 0.5

# print info on screen
docker container ls --filter "name=$DATABASE_CONTAINER_NAME"

echo "$LOG_PREFIX initializing the database with the tables defined in src/entities/"

yarn db:init

