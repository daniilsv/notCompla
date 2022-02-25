FROM node:14.9.0-alpine3.10
EXPOSE 3000

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm ci

COPY . /app

CMD NODE_ENV=production npm run start
