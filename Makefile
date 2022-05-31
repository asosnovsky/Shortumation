DC=docker-compose -f docker-compose.build.yaml -f docker-compose.test.yaml

build:
	$(DC) build\

push:
	$(DC) push

run:
	$(MAKE) build
	$(DC) up -d
	sleep 1
	$(DC) ps

logs:
	$(DC) logs -f

ps:
	$(DC) ps

stop:
	$(DC) stop

