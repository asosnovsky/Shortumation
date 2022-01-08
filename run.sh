#!/bin/bash

echo $(ls .)

python -m uvicorn src.app:app --host "0.0.0.0" --port 8000
