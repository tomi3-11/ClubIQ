# Simplifies common Docker commands for development

# Variables
FRONTEND_ID = $(shell docker compose ps -q frontend)
BACKEND_ID  = $(shell docker compose ps -q backend)
POSTGRES_ID = $(shell docker compose ps -q postgres)
NGINX_ID    = $(shell docker compose ps -q nginx)

# Help colors (enabled by default, disable with NO_COLOR)
COLOR_ENABLED = $(shell if [ -z "$(NO_COLOR)" ]; then echo 1; fi)
ifeq ($(COLOR_ENABLED),1)
CLR_RESET  = \033[0m
CLR_BOLD   = \033[1m
CLR_CYAN   = \033[36m
CLR_GREEN  = \033[32m
CLR_YELLOW = \033[33m
else
CLR_RESET  =
CLR_BOLD   =
CLR_CYAN   =
CLR_GREEN  =
CLR_YELLOW =
endif

########## UTIL ##########
# Ensures the container exists before using it
define ensure_exists
	@if [ -z "$(1)" ]; then \
		echo "No container found for service '$(2)' (is it built?)"; \
		exit 1; \
	fi
endef

# Default target
help:
	@printf "\n%b\n" "$(CLR_BOLD)ClubIQ Development Environment$(CLR_RESET)"
	@printf "%b\n\n" "$(CLR_CYAN)===============================$(CLR_RESET)"
	@printf "%b\n" "$(CLR_GREEN)Usage$(CLR_RESET)"
	@printf "  make <target>\n\n"
	@printf "%b\n" "$(CLR_YELLOW)Quick Search$(CLR_RESET)"
	@printf "  make help | grep -i <keyword>\n"
	@printf "  make help | grep -Ei 'postgres|nginx'\n\n"
	@printf "%b\n" "$(CLR_GREEN)Container Setup$(CLR_RESET)"
	@printf "%b\n" "$(CLR_CYAN)---------------$(CLR_RESET)"
	@printf "  %-24s %s\n" "build" "Build and start all containers"
	@printf "  %-24s %s\n" "build-detached" "Build and start all containers in detached mode"
	@printf "  %-24s %s\n" "up" "Start containers from existing images"
	@printf "  %-24s %s\n" "up-detached" "Start existing images in detached mode"
	@printf "\n"
	@printf "%b\n" "$(CLR_GREEN)Teardown$(CLR_RESET)"
	@printf "%b\n" "$(CLR_CYAN)--------$(CLR_RESET)"
	@printf "  %-24s %s\n" "down" "Remove containers and network"
	@printf "  %-24s %s\n" "down-volumes" "Remove containers, network, and named volumes"
	@printf "  %-24s %s\n" "down-remove-orphans" "Remove containers and orphaned services"
	@printf "  %-24s %s\n" "remove-images" "Remove containers and images from the Compose file"
	@printf "\n"
	@printf "%b\n" "$(CLR_GREEN)Service Control$(CLR_RESET)"
	@printf "%b\n" "$(CLR_CYAN)---------------$(CLR_RESET)"
	@printf "  %-24s %s\n" "start-all" "Start all containers"
	@printf "  %-24s %s\n" "stop-all" "Stop all containers"
	@printf "  %-24s %s\n" "start-frontend" "Start the frontend container"
	@printf "  %-24s %s\n" "stop-frontend" "Stop the frontend container"
	@printf "  %-24s %s\n" "start-backend" "Start the backend container"
	@printf "  %-24s %s\n" "stop-backend" "Stop the backend container"
	@printf "  %-24s %s\n" "start-postgres" "Start the postgres container"
	@printf "  %-24s %s\n" "stop-postgres" "Stop the postgres container"
	@printf "  %-24s %s\n" "start-nginx" "Start the nginx container"
	@printf "  %-24s %s\n" "stop-nginx" "Stop the nginx container"
	@printf "\n"
	@printf "%b\n" "$(CLR_GREEN)Recreate$(CLR_RESET)"
	@printf "%b\n" "$(CLR_CYAN)--------$(CLR_RESET)"
	@printf "  %-24s %s\n" "recreate-all" "Rebuild local images and recreate all containers"
	@printf "  %-24s %s\n" "recreate-frontend" "Force rebuild and recreate the frontend container"
	@printf "  %-24s %s\n" "recreate-backend" "Force rebuild and recreate the backend container"
	@printf "  %-24s %s\n" "recreate-postgres" "Force recreate the postgres container from its image"
	@printf "  %-24s %s\n" "recreate-nginx" "Force recreate the nginx container from its image"
	@printf "\n"
	@printf "%b\n" "$(CLR_GREEN)Logs$(CLR_RESET)"
	@printf "%b\n" "$(CLR_CYAN)----$(CLR_RESET)"
	@printf "  %-24s %s\n" "logs-all" "View live logs for all containers"
	@printf "  %-24s %s\n" "logs-frontend" "View live logs for the frontend container"
	@printf "  %-24s %s\n" "logs-backend" "View live logs for the backend container"
	@printf "  %-24s %s\n" "logs-postgres" "View live logs for the postgres container"
	@printf "  %-24s %s\n" "logs-nginx" "View live logs for the nginx container"
	@printf "\n"
	@printf "%b\n" "$(CLR_GREEN)Shell Access$(CLR_RESET)"
	@printf "%b\n" "$(CLR_CYAN)------------$(CLR_RESET)"
	@printf "  %-24s %s\n" "shell-frontend" "Open a shell inside the frontend container"
	@printf "  %-24s %s\n" "shell-backend" "Open a shell inside the backend container"
	@printf "  %-24s %s\n" "shell-postgres" "Open a shell inside the postgres container"
	@printf "  %-24s %s\n" "shell-nginx" "Open a shell inside the nginx container"
	@printf "\n"
	@printf "%b\n" "$(CLR_GREEN)Database$(CLR_RESET)"
	@printf "%b\n" "$(CLR_CYAN)--------$(CLR_RESET)"
	@printf "  %-24s %s\n\n" "migrate" "Run Flask migrations inside the backend container"




############################################################
# CONTAINER SETUP
############################################################

########## I. BUILD CONTAINERS IN ATTACHED MODE ##########
build:
	@echo "Creating ClubIQ containers..."
	docker compose up --build


########## II. BUILD CONTAINERS IN DETACHED MODE ##########
build-detached:
	@echo "Creating ClubIQ containers..."
	docker compose up -d --build



############################################################
# REBUILD CONTAINERS
############################################################

########## I. REBUILD CONTAINERS FROM EXISTING IMAGES WITHOUT CACHING IN ATTACHED MODE ##########
up:
	@echo "Rebuilding ClubIQ containers..."
	docker compose up


########## II. REBUILD CONTAINERS FROM EXISTING IMAGES WITHOUT CACHING IN DETACHED MODE ##########
up-detached:
	@echo "Rebuilding ClubIQ containers..."
	docker compose up -d



############################################################
# REMOVE CONTAINERS AND NETWORKING
############################################################
down:
	@echo "Removing ClubIQ containers..."
	docker compose down

down-volumes:
	@echo "Removing ClubIQ containers + volumes..."
	docker compose down --volumes

down-remove-orphans:
	@echo "Removing unused containers..."
	docker compose down --remove-orphans

remove-images:
	@echo "Removing all images from Compose file..."
	docker compose down --rmi all



############################################################
# START / STOP CONTAINERS
############################################################

########## I. START/STOP ALL ##########
start-all:
	@echo "Starting ALL containers..."
	docker compose up -d

stop-all:
	@echo "Stopping ALL containers..."
	docker compose stop


########## II. START/STOP FRONTEND CONTAINER ##########
start-frontend:
	@echo "Starting frontend..."
	docker compose up -d frontend

stop-frontend:
	@echo "Stopping frontend..."
	docker compose stop frontend


########## III. START/STOP BACKEND CONTAINER ##########
start-backend:
	@echo "Starting backend..."
	docker compose up -d backend

stop-backend:
	@echo "Stopping backend..."
	docker compose stop backend


########## IV. START/STOP POSTGRES CONTAINER ##########
start-postgres:
	@echo "Starting postgres..."
	docker compose up -d postgres

stop-postgres:
	@echo "Stopping postgres..."
	docker compose stop postgres


########## V. START/STOP NGINX CONTAINER ##########
start-nginx:
	@echo "Starting nginx..."
	docker compose up -d nginx

stop-nginx:
	@echo "Stopping nginx..."
	docker compose stop nginx



############################################################
# RECREATE CONTAINERS
############################################################

########## I. RECREATES ALL ##########
recreate-all:
	@echo "Killing all containers..."
	docker compose down --volumes
	@echo "Rebuilding local images..."
	docker compose build --no-cache backend frontend
	@echo "Refreshing pulled images..."
	docker compose pull postgres nginx
	@echo "Starting..."
	docker compose up -d --force-recreate
	@echo "All containers recreated!"


########## II. RECREATES FRONTEND CONTAINER ##########
recreate-frontend:
	@echo "Recreating frontend..."
	docker compose stop frontend || true
	docker compose rm -f frontend || true
	docker compose build --no-cache frontend
	docker compose up -d frontend


########## III. RECREATES BACKEND CONTAINER ##########
recreate-backend:
	@echo "Recreating backend..."
	docker compose stop backend || true
	docker compose rm -f backend || true
	docker compose build --no-cache backend
	docker compose up -d backend


########## IV. RECREATES POSTGRES CONTAINER ##########
recreate-postgres:
	@echo "Recreating postgres..."
	docker compose stop postgres || true
	docker compose rm -f postgres || true
	docker compose pull postgres
	docker compose up -d --force-recreate postgres


########## V. RECREATES NGINX CONTAINER ##########
recreate-nginx:
	@echo "Recreating nginx..."
	docker compose stop nginx || true
	docker compose rm -f nginx || true
	docker compose pull nginx
	docker compose up -d --force-recreate nginx



############################################################
# VIEW CONTAINER LOGS
############################################################

########## I. VIEW LOGS (ALL) ##########
logs-all:
	@echo "Viewing logs for ALL containers..."
	docker compose logs -f


########## II. VIEW LOGS (FRONTEND) ##########
logs-frontend:
	$(call ensure_exists,$(FRONTEND_ID),frontend)
	@echo "Logs for frontend:"
	docker logs -f $(FRONTEND_ID)


########## III. VIEW LOGS (BACKEND) ##########
logs-backend:
	$(call ensure_exists,$(BACKEND_ID),backend)
	@echo "Logs for backend:"
	docker logs -f $(BACKEND_ID)


########## IV. VIEW LOGS (POSTGRES) ##########
logs-postgres:
	$(call ensure_exists,$(POSTGRES_ID),postgres)
	@echo "Logs for postgres:"
	docker logs -f $(POSTGRES_ID)


########## V. VIEW LOGS (NGINX) ##########
logs-nginx:
	$(call ensure_exists,$(NGINX_ID),nginx)
	@echo "Logs for nginx:"
	docker logs -f $(NGINX_ID)



############################################################
# ENTER CONTAINER SHELLS
############################################################

########## I. ENTER FRONTEND CONTAINER ##########
shell-frontend:
	$(call ensure_exists,$(FRONTEND_ID),frontend)
	@echo "Entering frontend shell..."
	docker exec -it $(FRONTEND_ID) sh


########## II. ENTER BACKEND CONTAINER ##########
shell-backend:
	$(call ensure_exists,$(BACKEND_ID),backend)
	@echo "Entering backend shell..."
	docker exec -it $(BACKEND_ID) sh


########## III. ENTER POSTGRES CONTAINER ##########
shell-postgres:
	$(call ensure_exists,$(POSTGRES_ID),postgres)
	@echo "Entering postgres shell..."
	docker exec -it $(POSTGRES_ID) sh


########## IV. ENTER NGINX CONTAINER ##########
shell-nginx:
	$(call ensure_exists,$(NGINX_ID),nginx)
	@echo "Entering nginx shell..."
	docker exec -it $(NGINX_ID) sh



############################################################
# MANUAL MIGRATIONS FOR THE BACKEND
############################################################
migrate:
	@echo "Running database migrations..."
	docker compose exec backend flask db migrate -m "auto migration"
	docker compose exec backend flask db upgrade



############################################################
# PHONY DIRECTIVES
############################################################

# Prevents conflicts especially if there's a file with a name similar to one of the targets'
.PHONY: \
	help build build-detached up up-detached down down-volumes down-remove-orphans remove-images \
	logs-all logs-frontend logs-backend logs-postgres logs-nginx \
	recreate-all recreate-frontend recreate-backend recreate-postgres \
	start-all stop-all start-frontend stop-frontend start-backend stop-backend \
	start-postgres stop-postgres \
	shell-frontend shell-backend shell-postgres shell-nginx \
	start-nginx stop-nginx \
	recreate-nginx \
	migrate
