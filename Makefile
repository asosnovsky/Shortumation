DC=docker-compose -f docker-compose.build.yaml -f docker-compose.test.yaml

run_locally:
	$(DC) build
	$(DC) up -d
	$(DC) ps
