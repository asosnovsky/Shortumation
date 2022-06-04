# <--- Pre-Build Args --> 
ARG BUILD_ARCH

# <--- Image Setup --> 
FROM homeassistant/${BUILD_ARCH}-base-python:3.9-alpine3.14
WORKDIR /app

# <--- Post-Build Args --> 
ARG BUILD_VERSION

# <--- Environment Variables --> 
ENV BUILD_VERSION $BUILD_VERSION

# <--- System Wide Dependencies --> 
ENV LANG C.UTF-8
RUN apk add --no-cache \
    nodejs \
    npm \
    build-base \
    python3-dev  

# <--- Scripts --> 
COPY docker/bin /app/bin

# <--- PREP --> 
RUN /app/bin/prep.sh

# <--- Python Dependencies --> 
COPY api/setup.py /app/setup.py

# <--- Webapp Build --> 
COPY webapp/ /app/web-builder
RUN cd /app/web-builder && \
    echo "REACT_APP_BUILD_VERSION=${BUILD_VERSION}" > /app/web-builder/.env.production

# <--- BUILD --> 
RUN /app/bin/build.sh /app /app/web-builder

# <--- Api Code --> 
COPY api/src /app/src

# <--- Ports --> 
EXPOSE 8000

# <--- Final --> 
LABEL \
    io.hass.type="addon" \
    io.hass.arch="armhf|aarch64|i386|amd64"

ENTRYPOINT [ "/app/bin/run.sh" ]
CMD [ "/app" ]

LABEL org.opencontainers.image.source https://github.com/asosnovsky/Shortumation
