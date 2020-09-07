FROM node:12.16.3

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000
CMD [ "npm", "start" ]