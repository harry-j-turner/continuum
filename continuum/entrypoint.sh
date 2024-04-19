#!/bin/sh

# This script assumes that you pass "django" or "celery" as the first argument
# to the docker container to decide what process to start.

# Check if the script is running in a PostgreSQL environment
if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."

    # Loop until PostgreSQL is ready
    while ! nc -z $DB_HOST $DB_PORT; do
        sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Launch either Django or Celery.
case "$1" in
    django)
        python manage.py flush --no-input
        python manage.py migrate
        python manage.py seed
        python manage.py runserver 0.0.0.0:8000
        ;;
    celery)
        exec celery --app=continuum worker --loglevel=info
        ;;
    *)
        echo "Usage: $0 {django|celery}"
        exit 1
        ;;
esac