# <--- Pre-Build Args --> 
ARG BUILD_ARCH

# <--- Image Setup --> 
FROM homeassistant/${BUILD_ARCH}-base-python:3.9-alpine3.14
WORKDIR /app

# <--- Post-Build Args --> 
ARG BUILD_VERSION

# <--- Environment Variables --> 
ENV HASSIO_TOKEN ""
ENV BUILD_VERSION $BUILD_VERSION

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
    echo "REACT_APP_BUILD_VERSION=${BUILD_VERSION}" > /app/web-builder/.env.production && \
    yarn && \
    yarn build && \
    cp -r /app/web-builder/build /app/web && \
    rm -rf /app/web-builder

# <--- Api Code --> 
COPY api/src /app/src
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

# <--- Ports --> 
EXPOSE 8000

# <--- Final --> 
LABEL \
    io.hass.type="addon" \
    io.hass.arch="armhf|aarch64|i386|amd64"

CMD [ "/app/run.sh" ]

