# -------------------------------
# ClubIQ Backend (Flask + Postgres)
# -------------------------------

FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies for psycopg2 and others
RUN apt-get update && apt-get install -y \
  build-essential postgresql-client curl \
  libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy app source code
COPY . .

RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Expose Flask dev port
EXPOSE 5000

# Default command
ENTRYPOINT ["/app/entrypoint.sh"]
