VENV_FOLDER=./venv
VENV_BIN=$(VENV_FOLDER)/bin
PIP=$(VENV_BIN)/pip
PYTHON=$(VENV_BIN)/python

setup:
	rm -rf $(VENV_FOLDER)
	python3 -m venv $(VENV_FOLDER)
	$(PIP) install wheel==0.35.1
	$(PIP) install .[dev]

lint:
	$(VENV_BIN)/vulture src .vulture_whitelist
	$(MAKE) lint-project 
	$(MAKE) lint-tests 

lint-project:
	$(VENV_BIN)/black src
	$(VENV_BIN)/isort --trailing-comma src
	$(VENV_BIN)/mypy src


lint-tests:
	$(VENV_BIN)/black tests
	$(VENV_BIN)/isort --trailing-comma tests
	$(VENV_BIN)/mypy tests

security-checks:
	$(VENV_BIN)/bandit -r src 

test:
	$(PYTHON) -m unittest discover tests

coverage:
	$(VENV_BIN)/coverage run -m unittest discover tests
	$(VENV_BIN)/coverage report -m --fail-under=80

clean:
	rm -rf dist *.sqlite *.egg-info build .mypy_cache .coverage
	find . -type d -name  "__pycache__" -exec rm -r {} +
	find . -type d -name  "*tmp" -exec rm -r {} +

start-docker:
	rm -rf ./development_config
	tar -xvf ../development_config.tar.gz -C ./
	cp ./development_config/.env .env.api
	docker-compose down 
	docker-compose up 