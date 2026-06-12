FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk add --no-cache netcat-openbsd
RUN npm install --production

COPY . .

EXPOSE 3000
CMD ["npm", "start"]