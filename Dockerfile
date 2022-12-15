FROM node:16.15

WORKDIR /usr/src/app

# install app dependencies
COPY package*.json ./
RUN yarn

# bundle app source
COPY . .

CMD ["yarn", "dev"]