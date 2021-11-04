#!/bin/sh

echo "KEK"
echo "Waiting for Elasticsearch..."

while ! nc -z elasticsearch 9200; do
  sleep 0.1
done

echo "Elasticsearch started"

# flush удаляет все данные из бд
#python manage.py flush --no-input

python manage.py collectstatic --noinput
python manage.py migrate
python manage.py fill_adresses
python manage.py create_default_superuser
python manage.py search_index --rebuild -f

exec "$@"