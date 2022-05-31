#!/bin/bash

api_location=${1}

pushd $api_location
echo "--------------------"
echo "BUILD_VERSION = "$BUILD_VERSION
echo "SUPERVISOR_TOKEN = "$SUPERVISOR_TOKEN
echo $(python --version)
echo "--------------------"
python -m uvicorn src.app:app --host "0.0.0.0" --port 8000
