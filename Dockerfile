# <--- Build Args --> 
ARG BUILD_ARCH
ARG BUILD_VERSION

# <--- Image Setup --> 
FROM homeassistant/${BUILD_ARCH}-base-python:3.9-alpine3.14
WORKDIR /app

# <--- System Wide Dependencies --> 
ENV LANG C.UTF-8
RUN apk add --no-cache \
    nodejs \
    npm \
    build-base \
    python3-dev  
RUN pip install -U wheel setuptools pip && \ 
    npm i -g yarn

# <--- Python Dependencies --> 
COPY api/setup.py /app/setup.py
RUN pip install . /app

# <--- Webapp Build --> 
COPY webapp/ /app/web-builder
RUN cd /app/web-builder && \
    yarn && \
    yarn build && \
    cp -r /app/web-builder/build /app/web && \
    rm -rf /app/web-builder

# <--- Api Code --> 
COPY api/src /app/src
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

# <--- Environment Variables --> 
ENV HASSIO_TOKEN ""
ENV BUILD_VERSION $BUILD_VERSION

# <--- Ports --> 
EXPOSE 8000

# <--- Final --> 
LABEL \
    io.hass.type="addon" \
    io.hass.arch="armhf|aarch64|i386|amd64"

CMD [ "/app/run.sh" ]

