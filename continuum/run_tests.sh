#!/bin/bash

# This file is mostly so pre-commit can run the tests using the virtual environment.
# It assumes you're running from the root of the repository.

export DB_HOST=db                                                                                                                                                                  
export DB_NAME=continuum_db_dev
export DB_PASSWORD=password
export DP_PORT=5432
export DB_USER=continuum
export DEBUG=1
export SECRET_KEY=development
export DJANGO_ALLOWED_HOSTS="localhost 127.0.0.1 [::1]"
export CSRF_TRUSTED_ORIGINS=http://localhost:3000
export TESTING=1

cd "$(dirname "$0")"
source venv/bin/activate
python -m pytest  || exit 1
deactivate
