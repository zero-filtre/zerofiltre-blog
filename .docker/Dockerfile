FROM node:latest
WORKDIR /app
COPY . .

RUN apt-get update 
RUN apt-get -y install gettext-base
RUN apt-get clean
RUN npm install -g @angular/cli
RUN npm install -f

ADD .docker/entrypoint.sh entrypoint-dos.sh 

RUN sed -e 's/\r$//' entrypoint-dos.sh > entrypoint.sh
RUN chmod 755 entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]