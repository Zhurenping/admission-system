FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./

RUN npm install

COPY src ./src
COPY src/types ./src/types
COPY public ./public

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]