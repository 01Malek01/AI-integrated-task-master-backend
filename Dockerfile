# ========== Build Stage ==========
FROM node:20-alpine AS builder

WORKDIR /app

# Debug: Show current directory contents
RUN ls -la

# Copy package files and install dependencies
COPY package*.json ./
COPY tsconfig*.json ./

# Debug: Show files after copying package files
RUN ls -la

# Install dependencies first for better caching
RUN npm ci

# Copy source code
COPY . .

# Debug: Show files after copying source code
RUN ls -la

# Build the application and verify the dist directory
RUN npm run build && \
    echo "Build completed. Contents of /app:" && \
    ls -la && \
    echo "Contents of /app/dist:" && \
    ls -la dist/ || echo "dist directory not found!"

# ========== Production Stage ==========
FROM node:20-alpine

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Debug: Show what's being copied from builder
RUN echo "Copying from builder..." && \
    ls -la /app/dist 2>/dev/null || echo "No dist directory in builder yet"

# Create dist directory first to ensure it exists
RUN mkdir -p /app/dist

# Copy built files from builder
COPY --from=builder /app/dist/ ./dist/

# Debug: Verify files were copied
RUN echo "After copying from builder:" && \
    ls -la /app/dist/ 2>/dev/null || echo "Failed to copy dist directory"

# Copy environment files if they exist
RUN if [ -f /app/.env ]; then cp /app/.env .; fi

# Expose the app port (5000 is the default in your server.ts)
EXPOSE 5000

# Set the user to node for better security
USER node

# Start the application
CMD ["node", "dist/server.js"]

# ========== Development Stage ==========
# FROM node:20-alpine AS development
# WORKDIR /app

# # Copy package files and install all dependencies
# COPY package*.json ./
# RUN npm install

# # Copy source code
# COPY . .

# # Expose port
# EXPOSE 5000

# # Command to run the application with tsx watch
# CMD ["npm", "run", "dev"]
