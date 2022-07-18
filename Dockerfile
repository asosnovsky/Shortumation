# <--- Pre-Build Args --> 
ARG BUILD_ARCH

# <--- Web builder --> 
FROM node:16 AS web-builder

# <--- Post-Build Args --> 
ARG BUILD_VERSION

RUN npm i -g yarn

WORKDIR /web-builder
COPY webapp/ /web-builder

# Build web
RUN echo "REACT_APP_BUILD_VERSION=${BUILD_VERSION}" > /web-builder/.env.production
RUN yarn && yarn build

# <--- Main Image --> 
FROM python:3.9.13-slim-buster
WORKDIR /app

# <--- Post-Build Args --> 
ARG BUILD_VERSION

# <--- Environment Variables --> 
ENV BUILD_VERSION $BUILD_VERSION

# <--- System Wide Dependencies --> 
ENV LANG C.UTF-8
RUN apt-get update -y && \
    apt-get install -y gcc git build-essential libtool automake

# <--- Scripts --> 
COPY docker/bin /app/bin

# <--- PREP --> 
RUN /app/bin/prep.sh

# <--- Python Dependencies --> 
COPY api/setup.py /app/setup.py

# <--- BUILD --> 
RUN /app/bin/build.sh /app 

# <--- Api Code --> 
COPY api/src /app/src
COPY --from=web-builder /web-builder/build /app/web

# <--- Ports --> 
EXPOSE 8000

# <--- Final --> 
LABEL \
    io.hass.type="addon" \
    io.hass.arch="armhf|aarch64|i386|amd64|armv7"

ENTRYPOINT [ "/app/bin/run.sh" ]
CMD [ "/app" ]

LABEL org.opencontainers.image.source https://github.com/asosnovsky/Shortumation
