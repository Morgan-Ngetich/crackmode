#!/bin/sh

echo "Running in local environment. Using nginx.local.conf"
cp /etc/nginx/nginx.local.conf /etc/nginx/nginx.conf

echo "Current nginx.conf:"
cat /etc/nginx/nginx.conf

exec nginx -g "daemon off;"
