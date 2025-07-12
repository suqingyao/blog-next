#!/bin/bash

cd /root/workspace/blog-next
docker compose container prune -f
docker compose pull
docker compose up -d