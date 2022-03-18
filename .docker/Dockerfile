FROM node:latest as node
WORKDIR /app
COPY . .

RUN apt-get update 
RUN apt-get -y install gettext-base
RUN apt-get clean
RUN npm install -g @angular/cli
RUN npm install
RUN envsubst < src/app/environment.template.ts > environment.ts
RUN ng build && ng run zerofiltre-blog:server

# COPY dist/ /dist
# COPY .docker/entrypoint.sh entrypoint.sh
RUN chmod 755 .docker/entrypoint.sh
ENTRYPOINT [".docker/entrypoint.sh"]
EXPOSE 4000