# -------------------------------
# ClubIQ Frontend (Next.js + Clerk)
# -------------------------------

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY Frontend/package*.json ./
RUN npm install --legacy-peer-deps

# Copy project files
COPY Frontend/ .

# Expose Next.js dev port
EXPOSE 3000

# Start Next.js development server
CMD ["npm", "run", "dev"]
