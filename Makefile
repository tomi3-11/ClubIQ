# Simplifies common Docker commands for development

# Default Compose file
COMPOSE_FILE = docker-compose.dev.yml

# Default target
help:
	@echo ""
	@echo "Usage:"
	@echo "  make build                    - Build and start all containers"
	@echo "  make up                       - Start all containers"
	@echo "  make down                     - Stop all containers"
	@echo "  make rebuild                  - Force rebuild containers"
	@echo "  make logs                     - View live logs"
	@echo "  make front                    - Open a shell inside the frontend container"
	@echo "  make back                     - Open a shell inside the backend container"
	@echo "  make migrate                  - Run Flask migrations (migrate + upgrade)"
	@echo "  make clean                    - Remove all containers, networks, and volumes"
	@echo ""

build:
	@echo "Building ClubIQ containers..."
	docker compose -f $(COMPOSE_FILE) up --build

up:
	@echo "Starting ClubIQ containers..."
	docker start $$(docker ps -aq)

down:
	@echo "Stopping containers..."
	docker stop $$(docker ps -aq)

rebuild:
	@echo "Rebuilding containers..."
	docker compose -f $(COMPOSE_FILE) up --build --force-recreate

logs:
	docker compose -f $(COMPOSE_FILE) logs -f

front:
	docker exec -it clubiq_frontend sh

back:
	docker exec -it clubiq_backend sh

migrate:
	@echo "Running database migrations..."
	docker compose -f $(COMPOSE_FILE) exec backend flask db migrate -m "auto migration"
	docker compose -f $(COMPOSE_FILE) exec backend flask db upgrade

clean:
	@echo "Removing all containers, networks, and volumes..."
	docker compose -f $(COMPOSE_FILE) down --volumes
