#!/bin/bash

# Clean build directory
rm -rf dist

# Install dependencies
npm install

# Build the project
npm run build

echo "Build completed successfully!"
