#!/usr/bin/env bash

## IMPORTANT NOTE
# All paths and environment variables are strictly coupled with config.js and must be reviewed in case of change.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_VAR_FOLDER=$DIR/var

function init_database(){

    cp $DIR/database.sample.sqlite $DATABASE_PATH
    chown -R node.node $APP_VAR_FOLDER

}

function ssl_create_self_signed_certificate(){
    pushd .
    cd $APP_VAR_FOLDER
    if [[ -z "${SSL_CERTIFICATE_SUBJECT_STRING}" ]]; then
        SSL_CERTIFICATE_SUBJECT_STRING="/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com"
    fi
    openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
    -subj $SSL_CERTIFICATE_SUBJECT_STRING \
    -out server.cert -keyout server.key
    chown node.node server.key server.cert
    chmod 400 server.key server.cert
    popd
}

function ssl_certificate_setup(){
    if [[ -z "${SSL_B64_CERT}$" ]] || [[ -z "${SSL_B64_KEY}" ]]; then
        ssl_create_self_signed_certificate
    else
        echo $SSL_B64_CERT | base64 -d > $APP_VAR_FOLDER/server.cert
        echo $SSL_B64_KEY | base64 -d > $APP_VAR_FOLDER/server.key
    fi
}

DATABASE_PATH=$APP_VAR_FOLDER/database.sqlite
if [ ! -f $DATABASE_PATH ]; then
    init_database
fi

if [[ ! -z "${ENABLE_SSL}" ]]; then
    if [ ! -f $APP_VAR_FOLDER/server.crt ] || [ ! -f $APP_VAR_FOLDER/server.key ]; then
        ssl_certificate_setup
    fi
fi