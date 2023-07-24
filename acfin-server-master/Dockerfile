FROM node:13.10.1
WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules
RUN git config --global http.sslVerify false
RUN npm install
RUN git config --global http.sslVerify true
COPY ./ .
EXPOSE 3001
CMD [ "node", "start.js" ]