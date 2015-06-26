FROM node:0.10-onbuild

RUN npm install -g bower

ADD . /
WORKDIR /

RUN npm install
RUN bower install --allow-root

ENV SERVICE_PORT=5555

ENTRYPOINT npm start
