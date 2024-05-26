#! /bin/bash

python3 manage.py makemigrations
python3 manage.py migrate

if [ "$DJANGO_SUPERUSER_EMAIL" ]
then
    python manage.py createsuperuser \
        --noinput \
        --email $DJANGO_SUPERUSER_EMAIL
fi

exec "$@"
