#!/bin/bash

go install github.com/mirrorboards/mctl

mkdir $HOME/mirrorboards

curl -s https://raw.githubusercontent.com/mirrorboards/mirrorboards/refs/heads/main/mirror.toml -o "$HOME/mirrorboards/mirror.toml"

cd $HOME/mirrorboards

mctl sync