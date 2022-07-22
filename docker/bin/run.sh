#!/bin/bash

api_location=${1}
port=${PORT:-8000}
host=${HOST:-0.0.0.0}
host_port="$host:$port"

pushd $api_location
echo "--------------------"
echo "BUILD_VERSION = "$BUILD_VERSION
echo "HOST = $host_port"
echo $(python --version)
echo "--------------------"
python -m hypercorn src.app:app -b $host_port
