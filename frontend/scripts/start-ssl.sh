#!/bin/sh

echo "💻 Running in local development environment. Using nginx.local.conf"
export NODE_ENV=production

cp /etc/nginx/nginx.local.conf /etc/nginx/nginx.conf

# ✅ FIX 6: Add better error handling and logging
echo "Starting Node.js SSR server on port 8080..."
cd /app

# Check if server.js exists
if [ ! -f "scripts/server.js" ]; then
    echo "❌ ERROR: scripts/server.js not found!"
    exit 1
fi

# Start Node.js with error logging
node scripts/server.js > /var/log/node.log 2>&1 &
NODE_PID=$!

echo "Node.js PID: $NODE_PID"

# Wait for Node.js to start
echo "Waiting for Node.js to start..."
sleep 5

# ✅ FIX 7: Better health check with retries
RETRIES=0
MAX_RETRIES=10

while [ $RETRIES -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:8080/health >/dev/null 2>&1; then
        echo "✅ Node.js SSR server is healthy"
        break
    else
        echo "⏳ Waiting for Node.js... (attempt $((RETRIES + 1))/$MAX_RETRIES)"
        RETRIES=$((RETRIES + 1))
        sleep 2
    fi
done

if [ $RETRIES -eq $MAX_RETRIES ]; then
    echo "⚠️  Warning: Node.js SSR server did not respond to health check"
    echo "📋 Node.js logs:"
    cat /var/log/node.log
    # Continue anyway - nginx will try to proxy
fi

echo "📋 Validating nginx configuration..."
if ! nginx -t; then
    echo "❌ Nginx configuration is invalid!"
    exit 1
fi

echo "🚀 Starting nginx..."
exec nginx -g "daemon off;"