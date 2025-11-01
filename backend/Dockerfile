FROM node:18-bullseye-slim
WORKDIR /app

# Dependencias del sistema necesarias para Prisma (OpenSSL 1.1 / glibc)
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

EXPOSE 4000
CMD ["node","dist/server.js"]
