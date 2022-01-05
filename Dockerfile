ARG BUILD_FROM
ARG BUILD_VERSION
# ================
# Python Build Stage
# ================
FROM python:3.9 as pybuilder

WORKDIR /python

COPY api/setup.py /python/setup.py
RUN python -m venv /python/venv
RUN /python/venv/bin/pip install --use-feature=in-tree-build /python/ 

# ================
# Web Build Stage
# ================
FROM node:16.13.0-alpine as webbuilder

WORKDIR /web
COPY webapp/ /web
RUN npm install 
RUN yarn build

# ================
# Main Image
# ================
FROM $BUILD_FROM

ENV LANG C.UTF-8

WORKDIR /data
RUN apk add gcompat python3
RUN ln -s $(which python3) /usr/local/bin/python

COPY --from=pybuilder /python/venv /data/venv
COPY --from=webbuilder /web/build /data/web

COPY api/src /data/src
COPY run.sh run.sh

ENV HASSIO_TOKEN ""
ENV BUILD_VERSION $BUILD_VERSION

EXPOSE 8000

LABEL \
    io.hass.type="addon" \
    io.hass.arch="armhf|aarch64|i386|amd64"

CMD [ "/data/run.sh" ]

