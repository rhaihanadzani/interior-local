 FROM node:20-alpine as builder

 WORKDIR /work

 COPY package*.json ./
 RUN npm install --Omit=dev

 COPY . .
 RUN npm run build

 FROM node:20-alpine as runner

 WORKDIR /work

 COPY --from=builder /work/package*.json ./
 COPY --from=builder /work/node_modules ./node_modules
 COPY --from=builder /work/.next ./.next
 COPY --from=builder /work/public ./public
 COPY --from=builder /work/prisma ./prisma
 COPY --from=builder /work/node_modules/.prisma ./node_modules/.prisma

 EXPOSE 3000
 CMD ["npm", "run", "start"]