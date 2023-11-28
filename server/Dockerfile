
FROM node:18-alpine as development
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --force
RUN npm install -g concurrently
COPY . .
RUN npm run build
EXPOSE 3000

CMD [ "npm", "run", "dev" ]
