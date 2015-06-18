FROM node:0.10-onbuild

RUN npm install -g bower

ADD . /
WORKDIR /

RUN npm install
RUN bower install --allow-root

ENV SERVICE_PORT=5050
ENV DISCOVERY_SERVICE_URL=http://46.101.191.124:8500

ENTRYPOINT npm start
