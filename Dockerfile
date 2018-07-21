FROM node:8.11.3-stretch
EXPOSE 3000
ENV WORKING_DIR=/home/node/app
COPY . $WORKING_DIR
WORKDIR $WORKING_DIR
VOLUME $WORKING_DIR/var
CMD ./init_server.sh && su -c 'node ./index.js' node