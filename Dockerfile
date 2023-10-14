# Build stage:
# Use the official Node.js 16 image from Docker Hub
FROM node:16-alpine as build

# Set the working directory
WORKDIR /usr/src/app/msp

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies in root
RUN npm install

# Install dependencies in server folder
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy the rest of your app's source code
COPY . .

# Build the SvelteKit app
RUN npm run build

# Cleanup dev dependencies and install prod ones
RUN rm -rf ./node_modules && npm install --omit=dev

# Make dockerStart script executable
RUN chmod +x ./dockerStart.sh

###
# Bundle stage:

# Use the official Node.js 16 image from Docker Hub
FROM node:16-alpine

# Reset the working directory
WORKDIR /usr/src/app/msp

# Install PM2 and cleanup temp files
RUN npm install pm2 -g && rm -rf /root/.npm

# Copy files from build stage
COPY --from=build /usr/src/app/msp .

# Use dockerStart script as the entry point
ENTRYPOINT ["./dockerStart.sh"]
