FROM node:22
WORKDIR /app/Backend
COPY package*.json ./
RUN npm install --force
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]