# Simplifies common Docker commands for development

# Variables
FRONTEND_ID = $(shell docker compose ps -q frontend)
BACKEND_ID  = $(shell docker compose ps -q backend)
POSTGRES_ID = $(shell docker compose ps -q db)

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
	@echo ""
	@echo "ClubIQ Development Environment"
	@echo "--------------------------------"
	@echo "Usage:"
	@echo "  make build              	  	  - Build and start all containers"
	@echo "  make build-detached              	  - Build and start all containers in detached mode"
	@echo "  make up                 	  	  - Rebuilds containers from existing images"
	@echo "  make up-detached                 	  - Rebuilds containers from existing images in detached mode"
	@echo "  make down               	  	  - Breaks down existing containers but retains images and volumes"
	@echo "  make start-all              	  	  - Start all containers"
	@echo "  make stop-all               	  	  - Stop all containers"
	@echo "  make start-frontend              	  - Start frontend container"
	@echo "  make stop-frontend               	  - Stop frontend container"
	@echo "  make start-backend              	  - Start backend container"
	@echo "  make stop-backend               	  - Stop backend container"
	@echo "  make start-db              	  	  - Start postgres container"
	@echo "  make stop-db               	  	  - Stop postgres container"
	@echo "  make recreate-all            	  	  - Force rebuild and recreate all containers"
	@echo "  make recreate-frontend            	  - Force rebuild and recreate the frontend container"
	@echo "  make recreate-backend            	  - Force rebuild and recreate the backend container"
	@echo "  make recreate-db            	  	  - Force rebuild and recreate the postgres container"
	@echo "  make logs-all               	  	  - View live logs for all containers"
	@echo "  make logs-frontend               	  - View live logs for frontend container"
	@echo "  make logs-backend               	  - View live logs for backend container"
	@echo "  make logs-db               	  	  - View live logs for postgres container"
	@echo "  make sh-frontend     	  	  	  - Open a shell inside the frontend container"
	@echo "  make sh-backend      	  		  - Open a shell inside the backend container"
	@echo "  make sh-db      	  		  - Open a shell inside the postgres container"
	@echo "  make migrate            	  	  - Run Flask migrations"
	@echo ""




############################################################
# CONTAINER SETUP
############################################################

########## I. BUILD CONTAINERS IN ATTACHED MODE ##########
build:
	@echo "Creating ClubIQ containers...
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
	@echo "Breaking down ClubIQ containers..."
	docker compose down --volumes



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
start-db:
	@echo "Starting postgres..."
	docker compose up -d db

stop-db:
	@echo "Stopping postgres..."
	docker compose stop db




############################################################
# REBUILD CONTAINERS
############################################################

########## I. RECREATES ALL ##########
recreate-all:
	@echo "Killing all containers..."
	docker compose down --volumes
	@echo "Rebuilding..."
	docker compose build --no-cache
	@echo "Starting..."
	docker compose up -d
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
	docker compose build --no-cache postgres
	docker compose up -d postgres



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
logs-db:
	$(call ensure_exists,$(POSTGRES_ID),db)
	@echo "Logs for postgres:"
	docker logs -f $(POSTGRES_ID)



############################################################
# ENTER CONTAINER SHELLS (sh)
############################################################

########## I. ENTER FRONTEND CONTAINER ##########
sh-frontend:
	$(call ensure_exists,$(FRONTEND_ID),frontend)
	@echo "Entering frontend shell..."
	docker exec -it $(FRONTEND_ID) sh


########## II. ENTER BACKEND CONTAINER ##########
sh-backend:
	$(call ensure_exists,$(BACKEND_ID),backend)
	@echo "Entering backend shell..."
	docker exec -it $(BACKEND_ID) sh


########## III. ENTER POSTGRES CONTAINER ##########
sh-db:
	$(call ensure_exists,$(POSTGRES_ID),db)
	@echo "Entering postgres shell..."
	docker exec -it $(POSTGRES_ID) sh



############################################################
# MANUAL MIGRATIONS FOR THE BACKEND
############################################################
migrate:
	@echo "$(GREEN)Running database migrations...$(NC)"
	docker compose exec backend flask db migrate -m "auto migration"
	docker compose exec backend flask db upgrade



############################################################
# PHONY DIRECTIVES
############################################################

# Prevents conflicts especially if there's a file with a name similar to one of the targets'
.PHONY: \
	logs-all logs-frontend logs-backend logs-postgres \
	recreate-all recreate-frontend recreate-backend recreate-postgres \
	start-all stop-all start-frontend stop-frontend start-backend stop-backend \
	start-db stop-db \
	sh-frontend sh-backend sh-db
