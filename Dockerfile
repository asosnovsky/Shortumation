# <--- Build Args --> 
ARG BUILD_FROM
ARG BUILD_VERSION

# <--- Image Setup --> 
FROM $BUILD_FROM
WORKDIR /data

# <--- System Wide Dependencies --> 
ENV LANG C.UTF-8
RUN echo "https://dl-3.alpinelinux.org/alpine/v3.10/main" >> /etc/apk/repositories
RUN echo "https://dl-3.alpinelinux.org/alpine/v3.10/community" >> /etc/apk/repositories
RUN apk add --no-cache \
    cargo \ 
    gcompat \
    nodejs \
    python3 \
    python3-dev \  
    py3-pip \
    patchelf \
    rust 
RUN patchelf --add-needed libgcompat.so.0 /usr/bin/python3.9
RUN echo 'manylinux1_compatible = True' > /usr/lib/python3.9/_manylinux.py
RUN pip install -U wheel pip

# <--- Python Dependencies --> 
COPY api/setup.py /data/setup.py
RUN pip install . /data

# <--- Webapp Build --> 
COPY webapp/ /data/web-builder
RUN cd /data/web-builder && npm install 
RUN cd /data/web-builder && \
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

