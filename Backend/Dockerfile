# -------------------------------
# ClubIQ Backend (Flask + Postgres)
# -------------------------------

FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies for psycopg2 and others
RUN apt-get update && apt-get install -y netcat-traditional \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for caching)
COPY Backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source code
COPY Backend/ .

# Copy entrypoint
COPY Backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose Flask dev port
EXPOSE 5000

# Default command
ENTRYPOINT ["/entrypoint.sh"]
