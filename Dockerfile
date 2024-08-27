##### Dockerfile #####
## build stage ##
FROM node:20.17.0-alpine3.20 AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=development
COPY . .
RUN npm run build

## run stage ##
FROM node:20.17.0-alpine3.20 AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main.js"]
