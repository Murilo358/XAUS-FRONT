FROM node:18

WORKDIR /APP
COPY package*.json ./
RUN npm install --force 
COPY . . 

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0" ]