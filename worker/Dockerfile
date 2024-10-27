FROM node:20.18

WORKDIR /code/worker

COPY ./worker/package.json /code/worker/package.json
COPY ./shared/package.json /code/shared/package.json

RUN npm install