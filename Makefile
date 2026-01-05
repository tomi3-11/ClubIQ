# Simplifies common Docker commands for development

# Variables
FRONTEND_ID = $(shell docker compose ps -q frontend)
BACKEND_ID  = $(shell docker compose ps -q backend)
POSTGRES_ID = $(shell docker compose ps -q postgres)
PGADMIN_ID = $(shell docker compose ps -q pgadmin)

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
	@echo "  make build              	  	  	  	- Build and start all containers"
	@echo "  make build-detached              	  - Build and start all containers in detached mode"
	@echo "  make up                 	  	  	  	- Rebuilds containers from existing images"
	@echo "  make up-detached                 	  - Rebuilds containers from existing images in detached mode"
	@echo "  make down               	  	  	  	- Breaks down existing containers but retains images and volumes"
	@echo "  make start-all              	  	  	- Start all containers"
	@echo "  make stop-all               	  	  	- Stop all containers"
	@echo "  make start-frontend              	  - Start frontend container"
	@echo "  make stop-frontend               	  - Stop frontend container"
	@echo "  make start-backend              	  	- Start backend container"
	@echo "  make stop-backend               	  	- Stop backend container"
	@echo "  make start-db              	  	  	- Start postgres container"
	@echo "  make stop-db               	  	  	- Stop postgres container"
	@echo "  make recreate-all            	  	  - Force rebuild and recreate all containers"
	@echo "  make recreate-frontend            	  - Force rebuild and recreate the frontend container"
	@echo "  make recreate-backend            	  - Force rebuild and recreate the backend container"
	@echo "  make recreate-db            	  	  	- Force rebuild and recreate the postgres container"
	@echo "  make recreate-pgadmin            	  - Force rebuild and recreate the pgadmin container"
	@echo "  make logs-all               	  	  	- View live logs for all containers"
	@echo "  make logs-frontend               	  - View live logs for frontend container"
	@echo "  make logs-backend               	  	- View live logs for backend container"
	@echo "  make logs-db               	  	  	- View live logs for postgres container"
	@echo "  make logs-pgadmin               	  	- View live logs for pgadmin container"
	@echo "  make shell-frontend     	  	  	  	- Open a shell inside the frontend container"
	@echo "  make shell-backend      	  		  	  - Open a shell inside the backend container"
	@echo "  make shell-db      	  		  		  	- Open a shell inside the postgres container"
	@echo "  make shell-pgadmin      	  		  	  - Open a shell inside the pgadmin container"
	@echo "  make start-pgadmin               	  - Start pgadmin container"
	@echo "  make stop-pgadmin               	  	- Stop pgadmin container"
	@echo "  make migrate            	  	  	  	- Run Flask migrations inside the backend container"
	@echo "  make check-ssl-cert            	  	  	- Check pgAdmin SSL certificate expiration"
	@echo "  make generate-ssl-cert         	  	  	- Generate new SSL certificate for pgAdmin"
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


########## V. START/STOP PGADMIN CONTAINER ##########
start-pgadmin:
	@echo "Starting pgadmin..."
	docker compose up -d pgadmin

stop-pgadmin:
	@echo "Stopping pgadmin..."
	docker compose stop pgadmin



############################################################
# RECREATE CONTAINERS
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


########## V. RECREATES PGADMIN CONTAINER ##########
recreate-pgadmin:
	@echo "Recreating pgadmin..."
	docker compose stop pgadmin || true
	docker compose rm -f pgadmin || true
	docker compose build --no-cache pgadmin
	docker compose up -d pgadmin



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


########## V. VIEW LOGS (PGADMIN) ##########
logs-pgadmin:
	$(call ensure_exists,$(PGADMIN_ID),pgadmin)
	@echo "Logs for pgadmin:"
	docker logs -f $(PGADMIN_ID)



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
shell-db:
	$(call ensure_exists,$(POSTGRES_ID),db)
	@echo "Entering postgres shell..."
	docker exec -it $(POSTGRES_ID) sh


########## IV. ENTER PGADMIN CONTAINER ##########
shell-pgadmin:
	$(call ensure_exists,$(PGADMIN_ID),pgadmin)
	@echo "Entering pgadmin shell..."
	docker exec -it $(PGADMIN_ID) sh


############################################################
# MANUAL MIGRATIONS FOR THE BACKEND
############################################################
migrate:
	@echo "$(GREEN)Running database migrations...$(NC)"
	docker compose exec backend flask db migrate -m "auto migration"
	docker compose exec backend flask db upgrade



############################################################
# SSL CERTIFICATE MANAGEMENT
############################################################
check-ssl-cert:
	@echo "Checking pgAdmin SSL certificate..."
	@if [ ! -f pgadmin/pgadmin.crt ]; then \
		echo "ERROR: Certificate file not found at pgadmin/pgadmin.crt"; \
		exit 1; \
	fi
	@echo ""
	@echo "Certificate expiration date:"
	@openssl x509 -in pgadmin/pgadmin.crt -noout -enddate
	@echo ""
	@echo "Full certificate details:"
	@openssl x509 -in pgadmin/pgadmin.crt -noout -subject -issuer -dates
	@echo ""
	@echo "For more information, see: pgadmin/SSL_CERTIFICATE_MANAGEMENT.md"

generate-ssl-cert:
	@echo "Generating new SSL certificate for pgAdmin..."
	@if [ -f pgadmin/pgadmin.crt ] || [ -f pgadmin/pgadmin.key ]; then \
		echo "WARNING: Certificate or key file already exists."; \
		read -p "This will overwrite existing files. Press Enter to continue or Ctrl+C to cancel..."; \
	fi
	# NOTE: The -nodes flag creates an UNENCRYPTED private key to avoid interactive passphrase prompts,
	# which is convenient for local development and automation. For production or sensitive environments,
	# consider generating an ENCRYPTED key instead (omit -nodes and use a passphrase) and follow the
	# guidance in pgadmin/SSL_CERTIFICATE_MANAGEMENT.md.
	openssl req -x509 -newkey rsa:2048 -nodes \
		-keyout pgadmin/pgadmin.key \
		-out pgadmin/pgadmin.crt \
		-days 365 \
		-subj "/C=KE/ST=Nairobi/L=Nairobi/O=AppFactory" && \
		chmod 600 pgadmin/pgadmin.key && \
		chmod 644 pgadmin/pgadmin.crt
	@echo ""
	@echo "Certificate generated successfully!"
	@echo "Remember to restart pgAdmin: make recreate-pgadmin"
	@echo "Certificate details:"
	@openssl x509 -in pgadmin/pgadmin.crt -noout -dates



############################################################
# PHONY DIRECTIVES
############################################################

# Prevents conflicts especially if there's a file with a name similar to one of the targets'
.PHONY: \
	logs-all logs-frontend logs-backend logs-postgres \
	recreate-all recreate-frontend recreate-backend recreate-postgres \
	start-all stop-all start-frontend stop-frontend start-backend stop-backend \
	start-db stop-db \
	sh-frontend sh-backend sh-db \
	start-pgadmin stop-pgadmin \
	recreate-pgadmin \
	logs-pgadmin \
	check-ssl-cert generate-ssl-cert
