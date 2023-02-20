#!/usr/bin/env bash

set -o errexit  # exit on error

pip install -r requirements.txt

python manage.py migrate

cd frontend*copy

npm run build

cd ..
python manage.py collectstatic