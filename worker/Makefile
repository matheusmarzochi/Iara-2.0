up:
	@docker compose -f docker-compose.yml --env-file .env.local up -d
	
down:
	@docker compose -f docker-compose.yml --env-file .env.local down

build:
	@docker compose build

pnpm-install:
	@docker run --rm -v ./:/app app-api bash -c "pnpm install"

bash:
	@docker run -ti --rm \
		--network app_iara \
		--env-file .env.local \
		-v .:/code \
		-w /code \
		node:20-slim bash 
