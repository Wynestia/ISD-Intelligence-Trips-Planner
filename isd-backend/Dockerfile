FROM node:22-slim

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./

RUN npm ci

# Copy Prisma schema and generate client
COPY prisma/ ./prisma/
RUN npx prisma generate

# Copy the rest of the source
COPY . .

EXPOSE 3123

CMD ["npm", "run", "start"]
