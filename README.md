# RevierKompass

Eine moderne Web-Anwendung zur Verwaltung und Navigation von Polizeistationen in Baden-Württemberg.

## 🚀 Schnellstart

**1. Repository klonen**
```bash
git clone <repo-url>
cd revierkompass
```

**2. Abhängigkeiten installieren**
```bash
pnpm install
```

**3. Alles starten (Backend, DB, Frontend):**
```bash
pnpm run dev
```

**Fertig!**
- ✅ Backend läuft automatisch auf Port 3001
- ✅ Frontend auf Port 5173/5174 (automatisch gewählt)
- ✅ Datenbank & Seed werden automatisch eingerichtet
- ✅ Keine weitere Konfiguration nötig!

## 🚀 Schnellstart

### Automatischer Start (Empfohlen)
```bash
npm start
```
Dies startet automatisch:
- Backend-Server auf Port 3001
- Frontend-Server auf Port 5173 (oder höher)

### Manueller Start
```bash
# Backend starten
cd backend && node server.js

# Frontend starten (in neuem Terminal)
npm run dev
```

## 📁 Projektstruktur

```
revierkompass-v6/
├── backend/
│   ├── simple-server.js        # Express.js Backend
│   ├── prisma/                 # Datenbank-Schema
│   │   └── schema.prisma       # SQLite Schema
│   ├── src/scripts/            # Import & Seed Scripts
│   └── package.json
├── src/
│   ├── components/
│   │   ├── wizard/             # Wizard-Komponenten
│   │   │   └── Step3PremiumExport.tsx  # Routenberechnung
│   │   ├── map/                # Karten-Komponenten
│   │   └── admin/              # Admin-Komponenten
│   ├── lib/services/           # Services
│   │   └── routing-service.ts  # Echte Straßenrouten
│   └── store/                  # Zustand-Management
├── start-all.sh                # Automatisches Start-Skript
└── package.json
```

## 🔧 Technologien

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, Prisma
- **Datenbank**: SQLite mit Prisma ORM
- **Routing**: Echte Straßenrouten (OSRM, Valhalla, GraphHopper)
- **Karten**: MapLibre GL mit interaktiven Routen
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: Zustand

## 📊 Features

- ✅ **Echte Straßenrouten** statt Luftlinien
- ✅ **Interaktive Karten** mit MapLibre GL
- ✅ **Automatisches Start-System** (Backend + Frontend)
- ✅ **SQLite-Datenbank** mit Prisma ORM
- ✅ **Admin-Bereich** für Stationenverwaltung
- ✅ **Custom-Adressen** mit Koordinaten
- ✅ **Responsive Design**
- ✅ **Offline-Karten** Support

## 🛠️ Entwicklung

### Neue Station hinzufügen
1. Admin-Bereich öffnen (http://localhost:5174/admin)
2. "Neue Station" klicken
3. Daten eingeben und speichern

### Routenberechnung
- Verwendet echte Routing-APIs (OSRM, Valhalla, GraphHopper)
- Zeigt Straßenrouten auf der Karte an
- Fallback auf Luftlinie bei API-Problemen

### Custom-Adressen
- Werden in der SQLite-Datenbank gespeichert
- Koordinaten werden automatisch geocodiert
- Review-System für neue Adressen

## 🚨 Troubleshooting

### Automatischer Start funktioniert nicht
```bash
# Manuell starten
cd backend && node simple-server.js
# In neuem Terminal:
pnpm dev
```

### Datenbank zurücksetzen
```bash
cd backend
npx prisma db push --force-reset
npx tsx src/scripts/seed.ts
```

### Ports bereits belegt
- Das System wählt automatisch freie Ports
- Backend: 3001 (fest)
- Frontend: 5173, 5174, etc. (automatisch)

## 📝 API Endpoints

- `GET /health` - Health Check
- `GET /api/stationen` - Alle Stationen
- `POST /api/stationen` - Neue Station
- `PUT /api/stationen/:id` - Station aktualisieren
- `DELETE /api/stationen/:id` - Station löschen
- `GET /api/addresses` - Alle Adressen
- `POST /api/addresses` - Neue Adresse

## 📝 Lizenz

Proprietär - Alle Rechte vorbehalten
