FROM node:17.0.0-alpine

RUN mkdir -p /usr/src/app

COPY . usr/src/app

WORKDIR /usr/src/app/

RUN npm i

RUN npm install -g ts-node

COPY . .

EXPOSE 8080

ENTRYPOINT npm run dev
