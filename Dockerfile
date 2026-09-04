# Multi-stage build for Company app
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

# Build optimizations (minify, etc - optional)
RUN npm install -g http-server

# Production image
FROM node:18-alpine

WORKDIR /app

# Install minimal runtime
RUN apk add --no-cache tini

# Copy app files
COPY --from=builder /app .

# Install http-server
RUN npm install -g http-server

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Run app
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["http-server", "-p", "3000", "--gzip"]
