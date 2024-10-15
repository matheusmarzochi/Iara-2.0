# IARA - App

#### How to Run:
Follow the [Setup Doc](./SETUP.md)

#### Commands
```bash
make build          # Build Docker Image and install dependencies
make npm-install    # Install dependecies (App and Worker)
make up             # Start Containers
make down           # Stop Containers
make db-generate    # Generate migrations
make db-migrate:    # Apply migrations
make bash-app       # Access APP Bash
make bash-app       # Access Worker Bash
```

## Local Monitoring
- App: http://localhost:3001/
- Database: https://local.drizzle.studio/
- Ngrok Tunnel: http://localhost:4040/inspect/http
    - User: `rabbitmq`
    - Password: `RabbitPass`
