#!/bin/bash

api_location=${1}
port=${PORT:-8000}
host=${HOST:-0.0.0.0}
host_port="$host:$port"

pushd $api_location
echo "--------------------"
echo "BUILD_VERSION = "$BUILD_VERSION
echo "ARCH = "$BUILD_ARCH
echo "HOST = $host_port"
echo "HASSIO_WS = $HASSIO_WS"
echo $(uname -a)
echo $(python --version)
echo "--------------------"
python -m hypercorn src.app:app -b $host_port --config /app/hypercorn.toml
