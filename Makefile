IMAGE_NAME = thefactory-e2e-tests
ENV_FILE = .env.local
NODE_VERSION = 20
UBUNTU_VERSION = 22.04

build-playwright:
	docker build --build-arg NODE_VERSION=$(NODE_VERSION) --build-arg UBUNTU_VERSION=$(UBUNTU_VERSION) -t $(IMAGE_NAME) .

run-playwright:
	docker run -v $(shell pwd)/test-results:/usr/src/thefactory_frontend_task/test-results -v $(shell pwd)/playwright-report:/usr/src/thefactory_frontend_task/playwright-report --env-file $(ENV_FILE) $(IMAGE_NAME)
