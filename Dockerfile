ARG BUILD_FROM
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


ENV HASSIO_TOKEN ""

EXPOSE 8000

CMD [ "/data/venv/bin/python", "-m", "uvicorn", "src.app:app" ]
