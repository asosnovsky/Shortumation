#!/bin/bash

echo $(ls .)

/data/venv/bin/python -m uvicorn src.app:app --host "0.0.0.0" --port 8000
