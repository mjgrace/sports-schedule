# Stage-1 & specify a name 'builder'
FROM node:latest AS builder

# Create a directory  and go to the directory 
WORKDIR /app

# Copy the package*.json files to my current directory to install the necessary dependence  
COPY package*.json .

# Install the dependence
# RUN npm install

# Copy other files to my current directory
COPY . .

# Build and optimize static file
RUN npm ci
RUN npx react-scripts build
# RUN ls -al /app/build
# RUN sh

# Stage-2
FROM nginx:1.25.2-alpine-slim

# Copy the static file to my Nginx folder to serve static contain
COPY --from=builder /app/build /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/nginx.conf

# Open the port to react
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]