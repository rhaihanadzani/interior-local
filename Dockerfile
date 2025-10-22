# ==== BUILD STAGE ====
FROM node:20-alpine AS builder

WORKDIR /work

# Salin file package
COPY package*.json ./

# Install dependencies (termasuk devDependencies untuk build)
RUN npm ci

# Salin semua file proyek
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# ==== RUN STAGE ====
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only the necessary files
COPY --from=builder /work/package*.json ./
COPY --from=builder /work/node_modules ./node_modules
COPY --from=builder /work/.next ./.next
COPY --from=builder /work/public ./public
COPY --from=builder /work/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start"]
