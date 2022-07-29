#!/bin/bash

set -e

BIN_DIR="$( realpath $( dirname -- "${BASH_SOURCE[0]}" ) )"
VSCODE_DIR="$( dirname ${BIN_DIR} )"
WEBAPP_DIR="$( dirname ${VSCODE_DIR} )"
ROOT_DIR="$( dirname ${WEBAPP_DIR} )"

pushd $WEBAPP_DIR
rm -rf $WEBAPP_DIR/development_config
tar -xvf ../development_config.tar.gz -C $WEBAPP_DIR/
docker-compose down 
docker-compose up 