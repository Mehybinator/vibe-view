# Use the official Node.js 14 image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn run build

# Expose the port the app runs on
EXPOSE 4173

# Run the application
CMD ["yarn", "run", "preview"]