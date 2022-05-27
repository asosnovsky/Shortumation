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

declare -i err=0 werr=0
install_py &
install_yarn &
while wait -fn || werr=$?; ((werr != 127)); do
  err=$werr
done

echo "DONE BUILD"