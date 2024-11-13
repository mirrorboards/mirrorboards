#!/bin/bash

if [ -d ".github" ]; then
  rm -rf .github
fi

if [ -d ".github.public" ]; then
  mv .github.public .github
else
  echo ".github.public does not exist"
  exit 1
fi

# Handle README.md file
if [ -f "README.md" ]; then
  rm -f README.md
fi

if [ -f "README.public.md" ]; then
  mv README.public.md README.md
else
  echo "README.public.md does not exist"
  exit 1
fi
