# <--- Build Args --> 
ARG BUILD_ARCH
ARG BUILD_VERSION

# <--- Image Setup --> 
FROM homeassistant/${BUILD_ARCH}-base-python:3.9-alpine3.14
WORKDIR /data

# <--- System Wide Dependencies --> 
ENV LANG C.UTF-8
RUN apk add --no-cache \
    nodejs \
    npm \
    build-base \
    python3-dev  
RUN pip install -U wheel setuptools pip

# <--- Python Dependencies --> 
COPY api/setup.py /data/setup.py
RUN pip install . /data

# <--- Webapp Build --> 
COPY webapp/ /data/web-builder
RUN cd /data/web-builder && \
    npm i -g yarn \
    npm install && \
    yarn build && \
    cp -r /data/web-builder/build /data/web && \
    rm -rf /data/web-builder

# <--- Api Code --> 
COPY api/src /data/src
COPY run.sh run.sh

# <--- Environment Variables --> 
ENV HASSIO_TOKEN ""
ENV BUILD_VERSION $BUILD_VERSION

# <--- Ports --> 
EXPOSE 8000

# <--- Final --> 
LABEL \
    io.hass.type="addon" \
    io.hass.arch="armhf|aarch64|i386|amd64"
CMD [ "/data/run.sh" ]

