# ========== Build Stage ==========
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ========== Production Stage ==========
FROM node:20-alpine AS production
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Install production dependencies only
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env* ./

# Expose the app port
EXPOSE 5000

# Set the user to node for better security
USER node

# Start the application
CMD ["node", "dist/server.js"]

# ========== Development Stage ==========
FROM node:20-alpine AS development
WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Command to run the application with tsx watch
CMD ["npm", "run", "dev"]