FROM node:20-alpine AS base

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Build ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# BACKEND_URL must be available at build time so Next.js Server Components
# (e.g. destinations page) can pre-render with real data.
# Default is set for HF Spaces builds (override via --build-arg if needed).
ARG BACKEND_URL=https://investment-vision-attachments-floppy.trycloudflare.com
ENV BACKEND_URL=$BACKEND_URL

RUN npm run build

# ---- Production ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=7860
ENV HOSTNAME=0.0.0.0

# BACKEND_URL must also be set at runtime for the API proxy route.
# ENV does NOT carry over from the builder stage in multi-stage builds.
# HF Spaces secrets will override this if set; otherwise use the default.
ARG BACKEND_URL=https://investment-vision-attachments-floppy.trycloudflare.com
ENV BACKEND_URL=$BACKEND_URL

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 7860

CMD ["node", "server.js"]