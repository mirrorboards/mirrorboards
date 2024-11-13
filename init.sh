#!/bin/bash

# Default to the current directory if no argument is provided
TARGET_DIR=${1:-.}

# Find and remove node_modules directories
find "$TARGET_DIR" -name 'node_modules' -type d -prune -exec rm -rf '{}' +
echo "All node_modules directories have been removed from $TARGET_DIR."

find "$TARGET_DIR" -name 'dist' -type d -prune -exec rm -rf '{}' +
echo "All dist directories have been removed from $TARGET_DIR."

find "$TARGET_DIR" -name '.turbo' -type d -prune -exec rm -rf '{}' +
echo "All .turbo directories have been removed from $TARGET_DIR."

pnpm install

pnpm run build
