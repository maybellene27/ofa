FROM node:12.10.0 as build-stage
WORKDIR /app
COPY package*.json ./
RUN git config --global http.sslVerify false
RUN npm install
RUN git config --global http.sslVerify true
COPY ./ .
ARG webapi_domain
ARG webapi_path
ARG protocol
ENV VUE_APP_BASEURL=${protocol}${webapi_domain}${webapi_path}
CMD ["npm", "run", "build"]

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
