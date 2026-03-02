FROM node:20-bookworm-slim

WORKDIR /app

# Render injecte ses propres variables (PORT, DATABASE_URL, etc.)
ENV NODE_ENV=production

# Prisma a besoin d'OpenSSL dans l'image pour le schema engine/migrations.
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Installer les dependances en premier pour profiter du cache Docker
COPY package*.json ./
RUN npm ci

# Prisma doit connaitre le schema au build pour generer le client
COPY prisma ./prisma
RUN npx prisma generate

# Copier le code applicatif
COPY src ./src
COPY swagger.json ./swagger.json

# Utilisateur non-root
RUN useradd --create-home --shell /bin/bash appuser && chown -R appuser:appuser /app
USER appuser

# Render route le traffic vers le port defini par $PORT
EXPOSE 10000

# Applique les migrations puis demarre l'API
CMD ["sh", "-c", "npx prisma migrate deploy && node src/app.js"]
