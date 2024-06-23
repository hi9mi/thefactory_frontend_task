ARG UBUNTU_VERSION
FROM ubuntu:${UBUNTU_VERSION} as base

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update

RUN apt-get install -y curl

ARG NODE_VERSION
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
RUN apt-get install -y nodejs

WORKDIR /usr/src/thefactory_frontend_task

COPY package*.json ./

RUN npm ci

RUN npx playwright install --with-deps

COPY . .

ENV PW_BASE_URL=$PW_BASE_URL
ENV DEBUG=$DEBUG
ENV CI=$CI
ENV VITE_UNSPLASH_CLIENT_ID=$VITE_UNSPLASH_CLIENT_ID
ENV VITE_UNSPLASH_API_URL=$VITE_UNSPLASH_API_URL

CMD ["npm", "run", "test:e2e"]
