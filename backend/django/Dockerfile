FROM python:3.12-bullseye

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY reflected .
COPY tools/docker-entrypoint.sh /tmp/

RUN pip3 install -r requirements.txt

ENTRYPOINT [ "/bin/sh", "/tmp/docker-entrypoint.sh" ]

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
