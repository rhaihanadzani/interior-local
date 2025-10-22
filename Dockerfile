FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat
RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]
