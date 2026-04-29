# Use Node.js LTS as the base image (Node.js 18+ required)
FROM node:lts

# Set workdir
WORKDIR /app

# Global install of @antv/mcp-server-chart
RUN npm install -g @antv/mcp-server-chart

# Start the server (using streamable for transmission)
CMD ["mcp-server-chart", "--transport", "streamable", "--port", "1122"]