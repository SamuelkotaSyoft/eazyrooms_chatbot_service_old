FROM node:18

WORKDIR /usr/src/eazyrooms_chatbot_service

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3005

CMD ["node", "server.js"]