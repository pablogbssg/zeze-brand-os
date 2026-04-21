# ZEZE Brand OS

Dein persönliches Brand-Dashboard mit Kalender, Design-Files und Aufgaben.

---

## Schritt-für-Schritt: Von 0 bis Live

### Was du brauchst
- Ein kostenloses [GitHub-Konto](https://github.com)
- Ein kostenloses [Vercel-Konto](https://vercel.com) (mit GitHub einloggen)
- [Node.js](https://nodejs.org) (LTS-Version herunterladen & installieren)
- [VS Code](https://code.visualstudio.com) (empfohlen)

---

### Schritt 1 — Node.js installieren
1. Gehe auf https://nodejs.org
2. Lade die **LTS**-Version herunter
3. Installiere sie (einfach durchklicken)
4. Öffne Terminal (Mac) oder CMD (Windows) und tippe:
   ```
   node --version
   ```
   Du solltest etwas wie `v20.x.x` sehen.

---

### Schritt 2 — Projekt lokal starten
1. Entpacke den ZIP-Ordner `zeze-app`
2. Öffne Terminal im Ordner `zeze-app` (oder VS Code → Terminal öffnen)
3. Pakete installieren:
   ```
   npm install
   ```
4. App starten:
   ```
   npm run dev
   ```
5. Browser öffnet sich auf `http://localhost:5173` — deine App läuft lokal!

---

### Schritt 3 — GitHub Repository erstellen
1. Gehe auf https://github.com → **New Repository**
2. Name: `zeze-brand-os`
3. Sichtbarkeit: **Private** (empfohlen)
4. **Create repository** klicken
5. GitHub zeigt dir Befehle. Führe im Terminal aus:
   ```
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/zeze-brand-os.git
   git push -u origin main
   ```
   *(DEIN-USERNAME durch deinen GitHub-Usernamen ersetzen)*

---

### Schritt 4 — Auf Vercel deployen
1. Gehe auf https://vercel.com
2. **"Continue with GitHub"** → mit deinem GitHub-Konto einloggen
3. **"Add New Project"** klicken
4. Dein Repository `zeze-brand-os` auswählen → **Import**
5. Einstellungen lassen wie sie sind (Vercel erkennt Vite automatisch)
6. **Deploy** klicken
7. Nach ~1 Minute: Deine App ist live! 🎉

Du bekommst eine URL wie `zeze-brand-os.vercel.app`

---

### Schritt 5 — Eigene Domain (optional)
Falls du z.B. `app.zeze.ch` nutzen willst:
1. Vercel → dein Projekt → **Settings → Domains**
2. Deine Domain eingeben
3. Bei deinem Domain-Anbieter den DNS-Eintrag anpassen (Vercel erklärt es dir)

---

### Updates deployen (nach Schritt 4)
Jedes Mal wenn du Code änderst, einfach:
```
git add .
git commit -m "was du geändert hast"
git push
```
Vercel deployed automatisch — innerhalb von Sekunden ist es live.

---

## Projektstruktur

```
zeze-app/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx       # Navigation links
│   │   ├── Sidebar.module.css
│   │   ├── Topbar.jsx        # Header mit Datum
│   │   └── Topbar.module.css
│   ├── pages/
│   │   ├── Calendar.jsx      # Kalender-Seite
│   │   ├── Calendar.module.css
│   │   ├── Files.jsx         # Design Files mit Upload
│   │   ├── Files.module.css
│   │   ├── Todos.jsx         # Aufgaben Heute & Woche
│   │   └── Todos.module.css
│   ├── App.jsx               # Haupt-App
│   ├── App.module.css
│   ├── index.css             # Globale Styles
│   └── main.jsx              # Entry Point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Häufige Probleme

**`npm install` schlägt fehl**
→ Node.js neu installieren (LTS-Version)

**App startet nicht**
→ Bist du im richtigen Ordner? `cd zeze-app` dann `npm run dev`

**Vercel findet kein Framework**
→ Bei "Framework Preset" manuell **Vite** auswählen

---

Viel Erfolg mit ZEZE Brand OS! 🚀
