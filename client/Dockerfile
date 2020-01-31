FROM node:12

WORKDIR /usr/src/app/client/

COPY package*.json ./

COPY . .

#Install node_modules
RUN npm install && \
    npm install -g serve && \
    npm audit fix && \
    npm run build

EXPOSE 3000

CMD [ "npm", "run", "serve"]