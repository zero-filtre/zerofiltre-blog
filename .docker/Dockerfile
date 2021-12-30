FROM node:16

COPY dist/ /dist
COPY .docker/entrypoint.sh entrypoint.sh
RUN chmod 755 entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
EXPOSE 4000