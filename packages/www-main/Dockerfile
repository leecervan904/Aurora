FROM node:14-alpine

# RUN apk add --no-cache mongodb-tools

WORKDIR /app
COPY . /app

RUN npm install -g pnpm@6
RUN pnpm install

EXPOSE 3030

CMD ["npm", "run", "start:prod"]
