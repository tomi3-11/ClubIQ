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
	@echo "  make up        - Build and start all containers"
	@echo "  make down      - Stop and remove all containers"
	@echo "  make rebuild   - Force rebuild containers"
	@echo "  make logs      - View live logs"
	@echo "  make shell     - Open a shell inside the backend container"
	@echo "  make migrate   - Run Flask migrations (migrate + upgrade)"
	@echo "  make clean     - Remove all containers, networks, and volumes"
	@echo ""

up:
	@echo "$(GREEN)Starting ClubIQ containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) up --build

down:
	@echo "$(YELLOW)Stopping containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) down

rebuild:
	@echo "$(YELLOW)Rebuilding containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) up --build --force-recreate

logs:
	docker compose -f $(COMPOSE_FILE) logs -f

shell backend:
	docker compose -f $(COMPOSE_FILE) exec backend /bin/bash

shell frontend:
	docker compose -f $(COMPOSE_FILE) exec frontend /bin/bash

migrate:
	@echo "$(GREEN)Running database migrations...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend flask db migrate -m "auto migration"
	docker compose -f $(COMPOSE_FILE) exec backend flask db upgrade

clean:
	@echo "$(YELLOW)Removing all containers, networks, and volumes...$(NC)"
	docker compose -f $(COMPOSE_FILE) down -v
