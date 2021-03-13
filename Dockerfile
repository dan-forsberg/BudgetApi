FROM node:alpine
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
RUN yarn run build
EXPOSE 8080
CMD [ "yarn", "run", "start" ]