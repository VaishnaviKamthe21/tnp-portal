# Stage 1: Build Vite React SPA
FROM node:18-alpine AS builder

WORKDIR /app

# Install package dependencies first
COPY package*.json ./
RUN npm ci --silent

# Copy all source files
COPY . .

# Declare build argument and expose it as environment variable for Vite
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build the project
RUN npm run build

# Stage 2: Serve static production assets with Nginx
FROM nginx:alpine

# Copy compiled assets from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for React Router routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx default port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
