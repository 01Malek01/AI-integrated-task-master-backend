# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy source code
COPY . .
# Build the application
RUN npm run build 

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built files and additional required directories
COPY --from=builder /app/dist ./dist

# Copy other necessary files (like .env if needed)
COPY --from=builder /app/.env* ./
COPY --from=builder /app/package*.json ./

# Expose the app port
EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]
