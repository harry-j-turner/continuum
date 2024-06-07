#!/bin/bash

# Exit the script if any command fails
set -e

# Function to display usage help
usage() {
    echo "Usage: $0 -m <commit-message>"
    exit 1
}

# Parsing the commit message argument
while getopts ":m:" opt; do
  case $opt in
    m) commit_message="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
       usage
    ;;
  esac
done

# Check if commit message is empty
if [ -z "$commit_message" ]; then
    echo "Error: Commit message is required."
    usage
fi

# Step 1: Run tests
echo "Running tests..."
npm run test

# Step 2: Run lint
echo "Running linter..."
npm run lint

# Step 3: Git commit
echo "Committing changes..."
git add .
git commit -m "$commit_message"

# Step 4: Update Expo app
echo "Updating Expo app..."
eas update --auto --non-interactive

echo "Build and release process completed successfully."
