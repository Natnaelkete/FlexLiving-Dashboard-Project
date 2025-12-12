FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json .
COPY packages ./packages
COPY backend/package.json ./backend/

RUN npm install

WORKDIR /app/packages/types
RUN npm run build

WORKDIR /app/backend

CMD ["npm", "run", "dev"]
