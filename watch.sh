#!/bin/bash

# Authenticate with Amazon ECR
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 664735937512.dkr.ecr.eu-west-2.amazonaws.com

# Pull the latest image
output=$(docker pull 664735937512.dkr.ecr.eu-west-2.amazonaws.com/continuum:latest)

# Check if a new image was downloaded
if [[ $output == *"Downloaded newer image for"* ]] || [[ $output == *"Status: Downloaded newer image"* ]]; then
  echo "Downloading newer image."
  # Use docker-compose with the production yml file to restart the services
  docker-compose -f docker-compose.prod.yml down
  docker-compose -f docker-compose.prod.yml up -d
else
  echo "Image is up to date. No restart needed."
fi
