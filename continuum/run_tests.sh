#!/bin/bash

# This file is mostly so pre-commit can run the tests using the virtual environment.
# It assumes you're running from the root of the repository.

# Load environment variables from .env.dev
set -a 
source .env.dev
set +a 
export TESTING=1


cd "$(dirname "$0")"
source venv/bin/activate
python -m pytest -p no:warnings || exit 1
deactivate
