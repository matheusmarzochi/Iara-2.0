build:
	@docker compose build

up:
	@docker compose -f docker-compose.yml --env-file .env.local up -d

down:
	@docker compose -f docker-compose.yml --env-file .env.local down

npm-install:
	@echo "=== Instaling APP dependencies"
	@docker run --rm -v ./app/:/code iara-app bash -c "npm install"
	@echo "=== Instaling Worker dependencies"
	@docker run --rm -v ./worker/:/code iara-worker bash -c "npm install"

test-worker:
	@docker run -ti --rm \
		--name iara-worker-test \
		-v ./worker/:/code \
		-w /code \
		iara-worker npm test

bash-app:
	@docker run -ti --rm \
		--name iara-app-bash \
		-v ./app/:/code \
		-w /code \
		node:20.18 bash

bash-worker:
	@docker run -ti --rm \
		--name iara-worker-bash \
		-v ./worker/:/code \
		-w /code \
		iara-worker bash

db-generate:
	@docker run -ti --rm \
		--net app_iara \
		--name iara-db-generate \
		--env-file .env.local \
		-v ./app/:/code \
		iara-app npm run db:generate

db-migrate:
	@docker run -ti --rm \
		--net app_iara \
		--name iara-db-migrate \
		--env-file .env.local \
		-v ./app/:/code \
		iara-app npm run db:migrate
