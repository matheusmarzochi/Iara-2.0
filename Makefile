build:
	@docker compose build

up:
	@docker compose -f docker-compose.yml --env-file .env.local up -d

down:
	@docker compose -f docker-compose.yml --env-file .env.local down

npm-install:
	@echo "=== Instaling Shared dependencies"
	@docker run --rm -w /code/shared -v ./shared/:/code/shared iara-app bash -c "npm install"
	@echo "=== Instaling APP dependencies"
	@docker run --rm -v ./app/:/code/app -v ./shared/:/code/shared iara-app bash -c "npm install"
	@echo "=== Instaling Worker dependencies"
	@docker run --rm -v ./worker/:/code/worker -v ./shared/:/code/shared iara-worker bash -c "npm install"

test-worker:
	@docker run -ti --rm \
		--name iara-worker-test \
		-v ./worker/:/code/worker \
		-v ./shared/:/code/shared \
		iara-worker npm test

app-build:
	@docker run -ti --rm \
		--name iara-app-bash \
		--env-file .env.local \
		-v ./app/:/code/app \
		-v ./shared/:/code/shared \
		iara-app npm run build

bash-app:
	@docker run -ti --rm \
		--name iara-app-bash \
		-v ./app/:/code/app \
		-v ./shared/:/code/shared \
		iara-app bash

ollama-init:
	docker exec -it iara-ollama ollama run llama3.2

bash-shared:
	@docker run -ti --rm \
		--net iara \
		--name iara-shared-bash \
		--env-file .env.local \
		-v ./shared/:/code/shared \
		-w /code/shared \
		iara-app bash

bash-worker:
	@docker run -ti --rm \
		--net iara \
		--name iara-worker-bash \
		--env-file .env.local \
		-v ./worker/:/code/worker \
		-v ./shared/:/code/shared \
		iara-worker bash

seed-worker:
	@docker run -ti --rm \
		--net iara \
		--name iara-worker-bash \
		--env-file .env.local \
		-v ./worker/:/code/worker \
		-v ./shared/:/code/shared \
		iara-worker bash

db-generate:
	@docker run -ti --rm \
		--name iara-db-generate \
		--env-file .env.local \
		-v ./shared/:/code \
		-w /code \
		iara-app npm run db:generate

db-migrate:
	@docker run -ti --rm \
		--net iara \
		--name iara-db-migrate \
		--env-file .env.local \
		-v ./shared/:/code \
		-w /code \
		iara-app npm run db:migrate

db-sync:
	@rm -rf worker/src/database/
	@cp -r app/src/database/ worker/src/database


prd-db-migrate:
	@docker run -ti --rm \
		--name iara-db-migrate \
		--env-file .env.production \
		-v ./app/:/code \
		iara-app npm run db:migrate

prd-bash-worker:
	@docker run -ti --rm \
		--name iara-worker-bash \
		--env-file .env.production \
		-v ./worker/:/code/worker \
		-v ./app/node_modules:/code/app/node_modules \
		-v ./app/src/database:/code/app/src/database \
		iara-worker bash
