# Use the official Node.js 16 image from Docker Hub
FROM node:16

# Set the working directory
WORKDIR /usr/src/app/msp

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies in root
RUN npm install

# Install PM2
RUN npm install -g pm2


# Install dependencies in server folder
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy the rest of your app's source code
COPY . .

# Build the SvelteKit app
RUN npm run build

# Use pm2 and server script as the entry point
CMD ["pm2-runtime", "server/index.js"]
