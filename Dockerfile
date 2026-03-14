FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

# COPY source_current_folder --> /app
COPY . .

RUN yarn build

EXPOSE 8000

CMD ["yarn", "start:prod"]