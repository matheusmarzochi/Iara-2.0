# IARA - App

#### How to Run:
```bash
# Build Docker Image and install dependencies
make build
make pnpm-install

# Copy .env file
cp .env.example .env.local

# Start Containers
make up

# Stop Containers
make down
```

#### Commands
```bash
make build          # Build Docker Image and install dependencies
make npm-install    # Install dependecies
make up             # Start Containers
make down           # Stop Containers
make db-generate         # Generate migrations
make db-migrate:         # Apply migrations
```

## Ngrok Tunnel
Create an AuthToken to add to env
https://dashboard.ngrok.com/authtokens

Fill CLERK_WH_SECRET_KEY with your endpoint URL
https://dashboard.ngrok.com/endpoints

Restart you app
docker compose restart app

## Database

### Development

When in development, if you need to create a new table or change things around, use the `pnpm run db:push`. This will apply the changes directly in the database without creating any migrations. Note that this command can cause data loss, so only use it for development purposes.

### Handling database migrations
Once you're satisfied with the database changes, you can run the pnpm run `db:migrate` to create the migrations for the changes that you applied earlier with the `push` command.

#### Drop migrations
If you need to drop any created migration, use the following command: `npx drizzle-kit drop`. This will show you a list of the current migrations, and you can choose and drop any migration.

__Please avoid using this.__

### Studio
If you need to visualize the database data, you can run `pnpm run db:studio`. This will open a database tool for visualization and editing in your browser.

### Migrating
The migrations should happen automatically in production/staging/preview before the build command. We configure this in the Vercel build command settings as: `pnpm run db:migrate && pnpm run build`.
