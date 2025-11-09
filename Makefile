# Simplifies common Docker commands for development

# Default Compose file
COMPOSE_FILE = docker-compose.dev.yml

# Colors for readability
GREEN  := \033[0;32m
YELLOW := \033[1;33m
NC     := \033[0m

# Default target
help:
	@echo ""
	@echo "$(YELLOW)ClubIQ Development Environment$(NC)"
	@echo "--------------------------------"
	@echo "Usage:"
	@echo "  make build              - Build and start all containers"
	@echo "  make up                 - Start all containers (attached)"
	@echo "  make up-detached        - Start all containers (detached)"
	@echo "  make down               - Stop all containers"
	@echo "  make rebuild            - Force rebuild and recreate containers"
	@echo "  make logs               - View live logs"
	@echo "  make shell-frontend     - Open a shell inside the frontend container"
	@echo "  make shell-backend      - Open a shell inside the backend container"
	@echo "  make migrate            - Run Flask migrations"
	@echo "  make clean              - Remove all containers, networks, volumes"
	@echo ""

build:
	@echo "$(GREEN)Building ClubIQ containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) up --build

up:
	@echo "$(GREEN)Starting ClubIQ containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) up

up-detached:
	@echo "$(GREEN)Starting ClubIQ containers in detached mode...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d

down:
	@echo "$(YELLOW)Stopping containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) down

rebuild:
	@echo "$(YELLOW)Rebuilding containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) up --build --force-recreate

logs:
	docker compose -f $(COMPOSE_FILE) logs -f

shell-frontend:
	docker exec -it clubiq_frontend sh

shell-backend:
	docker exec -it clubiq_backend sh

migrate:
	@echo "$(GREEN)Running database migrations...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend flask db migrate -m "auto migration"
	docker compose -f $(COMPOSE_FILE) exec backend flask db upgrade

clean:
	@echo "$(YELLOW)Removing all containers, networks, and volumes...$(NC)"
	docker compose -f $(COMPOSE_FILE) down --volumes
