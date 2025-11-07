# FROM node:20-alpine
# WORKDIR /app

# # Copy only package files first
# COPY package*.json ./

# # Install dependencies
# RUN npm config set registry https://registry.npmmirror.com/ \
#     && npm config set fetch-retries 5 \
#     && npm config set fetch-retry-mintimeout 20000 \
#     && npm config set fetch-retry-maxtimeout 120000 \
#     && npm install

# # Then copy the rest of the app
# COPY . .

# # Build the app
# RUN npm run build

# EXPOSE 80
# CMD ["npm", "run", "start"]   # or whatever your start script is
# Build the static files


FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm install

COPY . .
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
