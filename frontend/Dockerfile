FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY packages ./packages
COPY frontend/package.json ./frontend

RUN npm install

WORKDIR /app/packages/types
RUN npm run build

WORKDIR /app/frontend

CMD ["npm", "run", "dev"]
