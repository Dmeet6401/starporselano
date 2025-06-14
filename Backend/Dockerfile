# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]