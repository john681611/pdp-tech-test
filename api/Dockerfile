FROM node:10.15-jessie
EXPOSE 5000
CMD npm start
COPY app.js/ app.js
COPY package.json/ package.json
COPY package-lock.json /package-lock.json
COPY services/ services
COPY config /config
COPY routes /routes
RUN npm i  --production