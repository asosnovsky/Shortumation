#!/bin/bash

echo $(python --version)
python -m uvicorn src.app:app --host "0.0.0.0" --port 8000
