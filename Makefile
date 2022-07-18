BUILD_TAG=$(shell git describe --tags | sed 's/\([^-]*-g\)/r\1/;s/-/./g')
DC=BUILD_TAG=${BUILD_TAG} docker-compose -f docker-compose.build.yaml -f docker-compose.test.yaml

build-with-builder:
	docker run \
		--rm \
		--privileged \
		-v ~/.docker:/root/.docker \
		-v /var/run/docker.sock:/var/run/docker.sock:ro \
		-v ${PWD}:/data \
		homeassistant/amd64-builder \
			--amd64 \
			--test \
			--version ${BUILD_TAG} \
			-t /data

build:
	cd webapp && yarn build
	$(DC) build

build-no-cache:
	cd webapp && yarn buil
	$(DC) build --no-cache

push:
	$(DC) push

start:
	$(DC) up -d
	sleep 1
	$(DC) ps

logs:
	$(DC) logs -f

ps:
	$(DC) ps

stop:
	$(DC) stop

bash:
	$(DC) exec addon bash

config:
	$(DC) config
