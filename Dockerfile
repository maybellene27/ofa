FROM node:14 as npm6
WORKDIR /app
# Create a node project using npm 6 and install a dev dependency
# that contains a binary.
RUN npm init --yes && \
    npm install --save-dev typescript

FROM node:12.10.0 as build-stage
WORKDIR /app
COPY --from=npm6
RUN git config --global http.sslVerify false
RUN npm install
RUN git config --global http.sslVerify true
COPY ./ .
ARG webapi_domain
ARG webapi_path
ARG protocol
ENV VUE_APP_BASEURL=${protocol}${webapi_domain}${webapi_path}
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
