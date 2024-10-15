## build stage ##
FROM node:20.18-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=development
COPY . .
RUN npm run build

## run stage ##
FROM node:20.18-alpine AS run
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/main.js"]
