FROM node:14-alpine as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
ARG API_URL
RUN echo "API_URL=$API_URL" >.env.production
RUN ["yarn", "run", "build"]

FROM nginx
EXPOSE 80
COPY --from=builder /app/public /usr/share/nginx/html
