FROM node:latest AS deps
LABEL stage=deps
LABEL autodelete="true"

WORKDIR /app
COPY package.json .

RUN npm install -g @angular/cli
RUN npm install -f

COPY . .
RUN ng build && ng run zerofiltre-blog:server

FROM node:16-alpine as prod
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist

EXPOSE 4000

ENTRYPOINT ["node", "dist/zerofiltre-blog/server/main.js"]