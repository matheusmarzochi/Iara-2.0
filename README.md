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
make up
```
