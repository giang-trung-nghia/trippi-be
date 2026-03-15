FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

ENV YARN_NETWORK_TIMEOUT=300000
RUN yarn install --network-timeout 300000

# COPY source_current_folder --> /app
COPY . .

RUN yarn build

EXPOSE 8000

CMD ["yarn", "start:prod"]