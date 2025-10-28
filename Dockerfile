FROM node:22.17.0-alpine AS base

# Install dependencies needed for building
RUN apk add --no-cache libc6-compat python3 make g++ bash curl wget
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --production=false

# Build stage - everything happens here in CI/CD
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# This will be handled by CI/CD, not here
# RUN pnpm exec payload migrate  # Moved to CI/CD
# RUN pnpm run build             # Moved to CI/CD

# Runtime stage - just run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV HOME=/app
ENV TMPDIR=/tmp
ENV USER=nextjs

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Create all necessary directories with proper permissions
RUN mkdir -p /app/public/media \
    && mkdir -p /app/.cache \
    && mkdir -p /app/.next \
    && mkdir -p /tmp \
    && chmod 1777 /tmp \
    && chown -R nextjs:nodejs /app

# Copy package files first (needed for pnpm prune)
COPY --chown=nextjs:nodejs package.json ./package.json
COPY --chown=nextjs:nodejs pnpm-lock.yaml ./pnpm-lock.yaml

# Copy production node_modules and prune dev dependencies
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm prune --prod

# Copy the built application from build context (includes .next built by CI)
COPY --chown=nextjs:nodejs .next ./.next
COPY --chown=nextjs:nodejs public ./public
COPY --chown=nextjs:nodejs next.config.mjs ./next.config.mjs
COPY --chown=nextjs:nodejs postcss.config.mjs ./postcss.config.mjs
COPY --chown=nextjs:nodejs tsconfig.json ./tsconfig.json
COPY --chown=nextjs:nodejs middleware.ts ./middleware.ts
COPY --chown=nextjs:nodejs components.json ./components.json
COPY --chown=nextjs:nodejs next-env.d.ts ./next-env.d.ts
COPY --chown=nextjs:nodejs src ./src
COPY --chown=nextjs:nodejs scripts ./scripts

# Clean up unnecessary files for production
RUN rm -rf /app/node_modules/@typescript-eslint \
    && rm -rf /app/node_modules/eslint* \
    && rm -rf /app/node_modules/@testing-library \
    && rm -rf /app/node_modules/playwright* \
    && rm -rf /app/node_modules/vitest* \
    && rm -rf /app/node_modules/@vitejs \
    && rm -rf /app/node_modules/jsdom

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Simple start - no migrations, no building, just run
CMD ["pnpm", "start"]
