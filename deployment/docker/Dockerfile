# Stage 1: Frontend Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY implementation/package*.json ./
RUN npm install

# Copy the rest of the source code and build
COPY implementation ./
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:1.17.8-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Set working directory
WORKDIR /usr/share/nginx/html/

# Copy built frontend from builder stage
COPY --from=builder /app/dist . 

# Expose port 80
EXPOSE 80

# Replace env.template.js and start nginx
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
