#!/bin/bash

# Coolify Deployment Script für Revierkompass
# Ausführen auf deinem lokalen System

set -e

echo "🚀 Coolify Deployment für Revierkompass wird gestartet..."

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funktionen
log_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Prüfe ob Git Repository existiert
if [ ! -d ".git" ]; then
    log_error "Kein Git Repository gefunden. Bitte führe 'git init' aus."
    exit 1
fi

# Prüfe ob alle Dateien committed sind
if [ -n "$(git status --porcelain)" ]; then
    log_warn "Es gibt uncommitted Änderungen. Committe sie zuerst:"
    git status --short
    echo ""
    read -p "Möchtest du trotzdem fortfahren? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 1. Code pushen
log_info "Code wird zu GitHub gepusht..."
git add .
git commit -m "feat: Coolify deployment configuration" || true
git push origin main

# 2. Environment-Datei erstellen
log_info "Environment-Datei wird erstellt..."
cat > .env.coolify << EOF
# Coolify Environment Configuration
DATABASE_URL=postgresql://revierkompass:revierkompass_secure_password_2024@postgres:5432/revierkompass
DB_USER=revierkompass
DB_PASSWORD=revierkompass_secure_password_2024
NODE_ENV=production
PORT=3001
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://revierkompass.mirosens.com,https://www.revierkompass.mirosens.com
LOG_LEVEL=info
EOF

log_info "Environment-Datei erstellt: .env.coolify"

# 3. Deployment-Status prüfen
log_info "Deployment-Status wird geprüft..."

# Prüfe ob Coolify läuft (falls du Zugriff auf den Server hast)
if command -v ssh &> /dev/null; then
    read -p "Möchtest du den Server-Status prüfen? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Server IP-Adresse: " SERVER_IP
        read -p "SSH Benutzer (default: root): " SSH_USER
        SSH_USER=${SSH_USER:-root}
        
        log_info "Verbindung zu Server wird hergestellt..."
        ssh -o ConnectTimeout=10 $SSH_USER@$SERVER_IP "docker ps | grep coolify" || {
            log_warn "Coolify läuft nicht auf dem Server. Führe das Installationsskript aus."
        }
    fi
fi

# 4. Nächste Schritte anzeigen
echo ""
log_info "✅ Deployment vorbereitet!"
echo ""
echo "📋 Nächste Schritte:"
echo ""
echo "1. 🔧 Server vorbereiten:"
echo "   ssh root@DEINE_SERVER_IP"
echo "   wget https://raw.githubusercontent.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/')/main/install-coolify.sh"
echo "   chmod +x install-coolify.sh"
echo "   ./install-coolify.sh"
echo ""
echo "2. 🌐 Coolify konfigurieren:"
echo "   Öffne: http://DEINE_SERVER_IP:8000"
echo "   Erstelle Admin-Konto"
echo "   Domain: revierkompass.mirosens.com"
echo ""
echo "3. 🚀 Backend deployen:"
echo "   New Resource → Application → Docker Compose"
echo "   Repository: $(git config --get remote.origin.url)"
echo "   File: docker-compose.coolify.yml"
echo ""
echo "4. 🗄️  Datenbank einrichten:"
echo "   New Resource → Database → PostgreSQL"
echo "   Name: revierkompass-db"
echo ""
echo "5. 🔄 Reverse Proxy:"
echo "   New Resource → Proxy"
echo "   Domain: revierkompass.mirosens.com"
echo "   Routes: /api/* → Backend, /* → Vercel"
echo ""
echo "📖 Detaillierte Anleitung: COOLIFY-DEPLOYMENT.md"
echo ""
log_info "Viel Erfolg beim Deployment! 🎉" 