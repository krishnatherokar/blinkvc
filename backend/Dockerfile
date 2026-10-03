FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV PORT=4000
EXPOSE ${PORT}
CMD ["node", "index.js"]

# docker build -t backend .
# docker run -d -p 4000:4000 --env-file .env --name backend-container backend