#!/bin/bash

cd /root/workspace/blog-next
docker compose down --remove-orphans
docker container prune -f
docker image prune -a -f
docker builder prune -a -f
docker compose pull
docker compose up -d --force-recreate
