#!/bin/bash

cd /root/workspace/blog-next
docker container prune -f
docker compose pull
docker compose up -d