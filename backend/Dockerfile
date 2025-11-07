FROM node:20-alpine
WORKDIR /app

COPY package*.json ./

# RUN npm install

RUN npm config set registry https://registry.npmmirror.com/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm install


COPY . .
RUN npm run build

EXPOSE 5000
CMD ["node", "dist/main.js"]
