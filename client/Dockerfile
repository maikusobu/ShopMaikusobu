# Use the official lightweight Node.js 18 image.
# https://hub.docker.com/_/node
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json or yarn.lock files into your app directory
COPY package*.json ./

# Install all dependencies.
# If you use Yarn, you could replace npm ci with yarn install
RUN npm ci --force

# Copy local code to the container image.
COPY . .

# Compile TypeScript into JavaScript
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Run the app in development mode on container startup.
CMD [ "npm", "run", "dev" ]
