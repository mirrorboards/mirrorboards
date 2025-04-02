#!/bin/bash

# Install mctl with proper version syntax
go install github.com/mirrorboards/mctl@latest

# If mirrorboards directory exists, rename it with timestamp
if [ -d "$HOME/mirrorboards" ]; then
    timestamp=$(date +%Y%m%d_%H%M%S)
    mv "$HOME/mirrorboards" "$HOME/mirrorboards-$timestamp"
    echo "Existing directory moved to $HOME/mirrorboards-$timestamp"
fi

# Create a fresh mirrorboards directory
mkdir "$HOME/mirrorboards"

# Download the configuration file
curl -s https://raw.githubusercontent.com/mirrorboards/mirrorboards/refs/heads/main/mirror.toml -o "$HOME/mirrorboards/mirror.toml"

# Change to the directory
cd "$HOME/mirrorboards"

# Run sync command
mctl sync
