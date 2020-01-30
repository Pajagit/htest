FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

# Install node_modules for server
RUN npm install

#Install node_modules
RUN cd client && \
    npm install && \
    npm install -g serve && \
    npm audit fix && \
    npm run build

EXPOSE 3000

EXPOSE 4000

EXPOSE 5000

CMD [ "npm", "run", "db-migrate"]

CMD [ "npm", "run", "db-seed-all"]

CMD [ "npm", "run", "prod"]