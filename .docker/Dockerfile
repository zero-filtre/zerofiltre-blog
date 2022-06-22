FROM node:latest AS builder
LABEL stage=builder

WORKDIR /app
COPY . .

RUN npm install -g @angular/cli
RUN npm install -f

RUN ng build && ng run zerofiltre-blog:server


FROM node:16-alpine
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist

EXPOSE 4000

ENTRYPOINT ["node", "zerofiltre-blog/server/main.js"]