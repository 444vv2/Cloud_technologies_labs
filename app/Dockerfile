FROM node:24.21.0-slim
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig*.json nest-cli.json ./

COPY src ./src
RUN npm run build

USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]