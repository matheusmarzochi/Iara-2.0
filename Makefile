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

app-build:
	@docker run -ti --rm \
		--name iara-app-bash \
		--env-file .env.local \
		-v ./app/:/code \
		-w /code \
		iara-app npm run build

bash-app:
	@docker run -ti --rm \
		--name iara-app-bash \
		-v ./app/:/code \
		-w /code \
		iara-app bash

ollama-init:
	docker exec -it iara-ollama ollama run llama3.2

bash-worker:
	@docker run -ti --rm \
		--net app_iara \
		--name iara-worker-bash \
		--env-file .env.local \
		-v ./worker/:/code/worker \
		-v ./app/node_modules:/code/app/node_modules \
		-v ./app/src/database:/code/app/src/database \
		iara-worker bash

seed-worker:
	@docker run -ti --rm \
		--net app_iara \
		--name iara-worker-bash \
		--env-file .env.local \
		-v ./worker/:/code/worker \
		-v ./app/src/database:/code/app/src/database \
		-w /code/worker \
		iara-worker bash

db-generate:
	@docker run -ti --rm \
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

db-sync:
	@rm -rf worker/src/database/
	@cp -r app/src/database/ worker/src/database
