# ==========================================
# Stage 1: Build & Dependencies
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files & prisma schema (supports root or backend subfolder build context)
COPY package*.json backend/package*.json* ./
COPY prisma* backend/prisma* ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .
RUN if [ -d "backend" ]; then cp -a backend/. .; fi

# Generate Prisma Client & compile TypeScript
RUN npm run db:generate
RUN npm run build

# ==========================================
# Stage 2: Production Runner Image
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install OpenSSL for Prisma query engine on Alpine
RUN apk add --no-cache openssl

# Create non-root system user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy build artifacts and dependencies from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

# Create logs directory and fix permissions
RUN chmod +x ./docker-entrypoint.sh && \
    mkdir -p logs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

# Health check configuration for Docker containers
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
