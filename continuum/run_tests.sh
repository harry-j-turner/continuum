#!/bin/bash

# This file is mostly so pre-commit can run the tests using the virtual environment.
# It assumes you're running from the root of the repository.

cd "$(dirname "$0")"
source venv/bin/activate
python -m pytest
deactivate
