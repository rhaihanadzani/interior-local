# ==== BASE IMAGE ====
FROM node:20-alpine

# Set workdir di container
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install semua dependency (termasuk devDependencies)
RUN npm install

# Copy semua source code (untuk npx prisma generate & run dev)
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port Next.js
EXPOSE 3000

# Jalankan perintah default
CMD ["npm", "run", "dev"]
