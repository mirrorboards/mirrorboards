#!/bin/env bash
FILE=tsconfig.json
if [ -f "$FILE" ]; then
    echo "Running TypeScript check for"
    pwd
    tsc --noEmit
fi
