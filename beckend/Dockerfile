FROM node:12

WORKDIR /usr/src/app/beckend/

COPY package*.json ./

COPY . .

# Install node_modules for server
RUN npm install

EXPOSE 4000

EXPOSE 5000

CMD [ "npm", "run", "prod"]