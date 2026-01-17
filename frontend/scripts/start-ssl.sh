#!/bin/sh
set -e

echo "💻 Running in local development environment. Using nginx.local.conf"
export NODE_ENV=production

cp /etc/nginx/nginx.local.conf /etc/nginx/nginx.conf

# Check if server.js exists
echo "🔍 Checking for server.js..."
if [ ! -f "scripts/server.js" ]; then
    echo "❌ ERROR: scripts/server.js not found!"
    exit 1
fi

# Start Node.js with labeled output (goes to stdout)
echo "🔥 Starting Node.js SSR server on port 8080..."
cd /app
node scripts/server.js 2>&1 | sed 's/^/[NODE] /' &
NODE_PID=$!

echo "✅ Node.js started with PID: $NODE_PID"

# Wait for Node.js to start with retries
echo "⏳ Waiting for Node.js to be ready..."
RETRIES=0
MAX_RETRIES=10

while [ $RETRIES -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:8080/health >/dev/null 2>&1; then
        echo "✅ Node.js SSR server is healthy"
        break
    else
        # Check if Node.js process is still running
        if ! kill -0 $NODE_PID 2>/dev/null; then
            echo "❌ ERROR: Node.js process died during startup!"
            exit 1
        fi
        
        echo "⏳ Waiting for Node.js... (attempt $((RETRIES + 1))/$MAX_RETRIES)"
        RETRIES=$((RETRIES + 1))
        sleep 2
    fi
done

if [ $RETRIES -eq $MAX_RETRIES ]; then
    echo "⚠️  Warning: Node.js SSR server did not respond to health check after ${MAX_RETRIES} attempts"
    echo "Continuing anyway - nginx will proxy when Node.js becomes ready"
fi

# ✅ Validate nginx configuration
echo "🔍 Validating nginx configuration..."
if ! nginx -t; then
    echo "❌ Nginx configuration is invalid!"
    exit 1
fi

# ✅Start nginx in background with labeled output
echo "🚀 Starting nginx..."
nginx -g "daemon off;" 2>&1 | sed 's/^/[NGINX] /' &
NGINX_PID=$!

echo "✅ Nginx started with PID: $NGINX_PID"
echo "🎉 All services running!"

#  Monitor both processes - exit if either dies
while true; do
    if ! kill -0 $NODE_PID 2>/dev/null; then
        echo "❌ Node.js process died! Exiting..."
        exit 1
    fi
    
    if ! kill -0 $NGINX_PID 2>/dev/null; then
        echo "❌ Nginx process died! Exiting..."
        exit 1
    fi
    
    sleep 5
done