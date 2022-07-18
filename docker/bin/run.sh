#!/bin/bash

api_location=${1}

pushd $api_location
echo "--------------------"
echo "BUILD_VERSION = "$BUILD_VERSION
echo $(python --version)
echo "--------------------"
python -m hypercorn src.app:app -b "0.0.0.0:8000"
