FROM node:lts-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Command will be provided by smithery.yaml
CMD ["node", "build/index.js"]