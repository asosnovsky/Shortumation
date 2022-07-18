#!/bin/bash
set -e

api_location=${1}
web_location=${2}

function install_yarn() {
    pushd $web_location
    yarn 
    yarn build
    cp -r $web_location/build $api_location/web 
    popd
}

function install_py() {
    pushd $api_location
    pip install . $api_location
    popd
}

install_py
install_yarn

echo "DONE BUILD"
