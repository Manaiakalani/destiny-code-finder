# Build stage
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

# Production stage — unprivileged nginx on port 8080
FROM nginx:alpine

# Remove default config and add wget for healthcheck
RUN apk add --no-cache wget \
    && rm /etc/nginx/conf.d/default.conf

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && mkdir -p /var/cache/nginx /var/log/nginx /var/run \
    && chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html

COPY --from=build --chown=appuser:appgroup /app/dist /usr/share/nginx/html

# Nginx config
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 8080;
    server_tokens off;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Cache static assets (hashed filenames from Vite)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache emblem data (refresh hourly)
    location /data/ {
        expires 1h;
        add_header Cache-Control "public";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
}
EOF

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:8080/ || exit 1

USER appuser
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
