# Docker Setup

This directory contains Docker Compose configuration for running test databases locally.

## Services

- **PostgreSQL 17 Alpine**: Running on port `5432` (configurable via `POSTGRES_PORT`)
- **MariaDB 11.4**: Running on port `3306` (configurable via `MYSQL_PORT`)

## Quick Start

```bash
# Start all services
docker compose -f docker/docker-compose.yml up -d

# Check service status
docker compose -f docker/docker-compose.yml ps

# View logs
docker compose -f docker/docker-compose.yml logs

# Stop all services
docker compose -f docker/docker-compose.yml down

# Stop and remove volumes (removes all data)
docker compose -f docker/docker-compose.yml down -v
```

## Database Connection Details

### PostgreSQL
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `drizzle_test`
- **Username**: `test_user`
- **Password**: `test_password`

### MariaDB
- **Host**: `localhost`
- **Port**: `3306`
- **Database**: `drizzle_test`
- **Username**: `test_user`
- **Password**: `test_password`
- **Root Password**: `root_password`

## Environment Variables

Create a `.env` file in the docker directory to override default values:

```env
# Port Configuration
POSTGRES_PORT=5432
MYSQL_PORT=3306

# PostgreSQL Configuration
POSTGRES_DB=drizzle_test
POSTGRES_USER=test_user
POSTGRES_PASSWORD=test_password

# MariaDB Configuration
MARIADB_DATABASE=drizzle_test
MARIADB_USER=test_user
MARIADB_PASSWORD=test_password
MARIADB_ROOT_PASSWORD=root_password
```

All environment variables have sensible defaults, so you only need to override the ones you want to change.

## Health Checks

Both services include health checks to ensure they're ready before running tests:

- **PostgreSQL**: Uses `pg_isready` command
- **MariaDB**: Uses built-in `healthcheck.sh` script


## Volumes

Data is persisted in named Docker volumes:

- `drizzle_repositories_postgres_data`: PostgreSQL data
- `drizzle_repositories_mariadb_data`: MariaDB data