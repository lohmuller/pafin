# Use the official Node.js image as the base image
FROM node:18

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install --no-fund

COPY src ./src

# Compile the typescript to javascript
RUN npm run build

COPY .sequelizerc ./

# Adding the port 3000 to expose
EXPOSE 3000

CMD ["npm", "run", "start"]
