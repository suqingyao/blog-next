#!/bin/bash

cd /root/workspace/blog-next
docker compose down --remove-orphans
docker compose pull
docker compose up -d