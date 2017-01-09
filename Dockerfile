FROM node:7.2.1

RUN npm config set color false
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --release
COPY . /usr/src/app
ENV NODE_ENV production

CMD [ "npm", "start" ]
