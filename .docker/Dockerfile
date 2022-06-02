# FROM node:latest
# WORKDIR /app
# COPY . .

# RUN apt-get update 
# RUN apt-get -y install gettext-base
# RUN apt-get clean
# RUN npm install -g @angular/cli
# RUN npm install -f

# ADD .docker/entrypoint.sh entrypoint-dos.sh 

# RUN sed -e 's/\r$//' entrypoint-dos.sh > entrypoint.sh
# RUN chmod 755 entrypoint.sh

# EXPOSE 4000

# ENTRYPOINT ["./entrypoint.sh"]


FROM node:latest AS builder

WORKDIR /app
COPY package.json ./

RUN apt-get update && apt-get -y install gettext-base

RUN npm install -g @angular/cli
RUN npm install -f

RUN envsubst < src/environments/environment.template.ts > src/environments/environment.ts

RUN ng build && ng run zerofiltre-blog:server



FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist/zerofiltre-blog/browser ./
COPY --from=builder /app/dist/zerofiltre-blog/server ./

EXPOSE 4000

ENTRYPOINT ["node", "server/main.js"]