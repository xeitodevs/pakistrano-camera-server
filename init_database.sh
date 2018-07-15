#!/usr/bin/env bash


### DATABASE_PATH is aligned with the environment var in config.js.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DATABASE_FOLDER=$DIR/var
DATABASE_PATH=$DATABASE_FOLDER/database.sqlite
if [ ! -f $DATABASE_PATH ]; then
    cp $DIR/database.sample.sqlite $DATABASE_PATH
    chown -R node.node $DATABASE_FOLDER
fi