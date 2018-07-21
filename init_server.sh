#!/usr/bin/env bash

## IMPORTANT NOTE
# All paths and environment variables are strictly coupled with config.js and must be reviewed in case of change.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/init_server_functions.sh

if [ ! -f $DATABASE_PATH ]; then
    init_database node
fi

if [[ ! -z "${ENABLE_SSL}" ]]; then
    if [ ! -f $APP_VAR_FOLDER/server.crt ] || [ ! -f $APP_VAR_FOLDER/server.key ]; then
        ssl_certificate_setup
    fi
fi