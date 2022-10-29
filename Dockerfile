FROM node:17.0.0-alpine
RUN mkdir -p /usr/src/app
COPY . usr/src/app
WORKDIR /usr/src/app/
RUN npm i
COPY . .
EXPOSE 8080
CMD [ "CMD", "npm run dev" ]