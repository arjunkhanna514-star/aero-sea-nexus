# 🚀 Aero-Sea Nexus — v3.0.1

Advanced global maritime and aviation intelligence platform featuring:
- **Quantum Navigation** — GPS-independent positioning via gravity gradient
- **Quantum Swarm** — 1,000,000 simultaneous route optimization
- **Eagle Eye** — Bioluminescence wave radar + LiDAR CAT detection
- **Real AI Agent** — Powered by Claude (Anthropic API)
- **10,000+ Dataset** — Downloadable global port & airline archive

---

## ⚡ Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Add your Anthropic API key
# Create a .env file in the root folder and add:
# VITE_ANTHROPIC_KEY=your_anthropic_api_key_here

# 3. Run locally
npm run dev

# Opens at: http://localhost:5173
```

---

## 🔑 API Key Setup

The AI Agent requires an Anthropic API key.

1. Get your key at: https://console.anthropic.com
2. Create a file called `.env` in the project root
3. Add this line: `VITE_ANTHROPIC_KEY=sk-ant-your-key-here`
4. In `src/App.jsx`, update the fetch headers:
   ```js
   headers: {
     "Content-Type": "application/json",
     "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
     "anthropic-version": "2023-06-01",
     "anthropic-dangerous-direct-browser-access": "true"
   }
   ```

---

## 🌐 Deploy to Vercel

### Option A — GitHub + Vercel Dashboard (Recommended)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/aero-sea-nexus.git
git push -u origin main
```
Then go to https://vercel.com → Import your GitHub repo → Deploy.
Add `VITE_ANTHROPIC_KEY` in Vercel → Settings → Environment Variables.

### Option B — Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📁 Project Structure

```
aero-sea-nexus/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          ← Main application (all components)
│   └── main.jsx         ← React entry point
├── .env                 ← Your API key (never commit this)
├── .gitignore
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Recharts | Charts & visualizations |
| Lucide React | Icons |
| Anthropic Claude | AI Agent backend |

---

## 📝 License

© 2026 Aero-Sea Nexus. All rights reserved.
