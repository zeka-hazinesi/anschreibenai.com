# ---------- 1. Build Stage ----------
  FROM node:latest AS builder

  WORKDIR /app
  
  COPY package*.json ./
  RUN npm install
  
  COPY . .
  RUN npm run build
  
  
  # ---------- 2. Dependencies Stage ----------
  FROM node:latest AS deps
  
  WORKDIR /app
  
  COPY package*.json ./
  RUN npm install --omit=dev
  
  
  # ---------- 3. Runtime Stage ----------
  FROM node:latest AS runner
  
  WORKDIR /app
  
  # Set port env
  ENV PORT=3888
  
  # Copy production node_modules only
  COPY --from=deps /app/node_modules ./node_modules
  
  # Copy only the necessary files from builder
  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/next.config.ts ./next.config.ts
  COPY --from=builder /app/package.json ./package.json
  
  EXPOSE 3888
  
  CMD ["npm", "start"]
  