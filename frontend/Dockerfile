ARG RELEASE=latest

FROM nginx:${RELEASE}

# RUN apt-get update && \
#     apt-get upgrade

COPY . /usr/share/nginx/html
COPY ./tools/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html/