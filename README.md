# Destiny 2 Code Vault 🔐

[![Destiny 2](https://img.shields.io/badge/Destiny%202-Code%20Vault-7b68ee?style=for-the-badge)](https://www.bungie.net/7/en/Destiny)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A fast, privacy-focused web application for discovering and redeeming Destiny 2 emblem codes. Aggregates codes from multiple community sources in real-time.

## ✨ Features

- **🔍 Multi-Source Aggregation** — Automatically scrapes Reddit, Blueberries.gg, and curated databases
- **🖼️ Official Emblem Previews** — Displays high-quality images directly from Bungie's CDN
- **⚡ Lightning Fast** — Built with Vite + React for instant page loads
- **🎨 Beautiful UI** — NASA-inspired "Deep Space" theme with Destiny 2 subclass colors
- **📱 Fully Responsive** — Works flawlessly on desktop, tablet, and mobile
- **🔒 Privacy-First** — Zero cookies, zero tracking, zero analytics
- **🌙 Theme Support** — Dark, OLED, and Light modes
- **✨ Visual Effects** — Shooting stars, particle effects, and emblem shine animations

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Manaiakalani/destiny-code-finder.git
cd destiny-code-finder

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:8080**

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
destiny-code-finder/
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
├── public/
│   ├── data/
│   │   └── emblems.json   # Emblem database (1000+ emblems)
│   └── emblems/           # Cached emblem images
├── scripts/
│   ├── scrape-emblems.js  # Bungie manifest scraper
│   └── download-emblems.js # Image downloader
├── src/
│   ├── components/        # React components
│   │   ├── ui/            # Base UI components
│   │   ├── CodeCard.tsx   # Emblem code card
│   │   ├── Header.tsx     # Navigation header
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Route pages
│   ├── services/          # API & scraping services
│   └── types/             # TypeScript definitions
├── Dockerfile             # Production container
└── package.json
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run scrape:emblems` | Fetch latest emblem data from Bungie API |
| `npm run download:emblems` | Download and cache emblem images |

### Running Emblem Scripts

The scrape scripts require a Bungie API key (free):

```bash
# Get your key at: https://www.bungie.net/en/Application
# Then run:
BUNGIE_API_KEY=your_key npm run scrape:emblems
```

## 🐳 Docker

### Build and Run

```bash
# Build the Docker image
docker build -t destiny-code-vault .

# Run the container (runs as non-root on port 8080)
docker run -p 8080:8080 destiny-code-vault
```

### Docker Compose

```yaml
version: '3.8'
services:
  destiny-code-vault:
    build: .
    ports:
      - "8080:8080"
    restart: unless-stopped
    read_only: true
    security_opt:
      - no-new-privileges:true
```

## 🎯 Data Sources

The app aggregates emblem codes from multiple sources:

| Source | Description |
|--------|-------------|
| **Reddit** | r/DestinyTheGame, r/destiny2, r/raidsecrets |
| **Blueberries.gg** | Community-verified emblem database |
| **Bungie API** | Official emblem images and metadata |
| **Curated List** | 37+ manually verified active codes |

## 🎨 Design System

The UI features a NASA-inspired "Deep Space" theme:

- **Primary**: NASA Blue (`#0b3d91`)
- **Accent**: Tech Cyan (`#4dd0e1`)
- **Success/Active**: Strand Green
- **Warning**: Solar Orange
- **Background**: Deep space gradient

### Destiny 2 Subclass Colors

- 🟣 **Void**: Purple (`#7c3aed`)
- 🟠 **Solar**: Orange (`#f97316`)
- 🔵 **Arc**: Cyan (`#06b6d4`)
- 🔷 **Stasis**: Ice Blue (`#38bdf8`)
- 🟢 **Strand**: Green (`#22c55e`)

## 🔒 Privacy

Code Vault is built with privacy as a core principle:

- ✅ No cookies
- ✅ No analytics or tracking
- ✅ No user accounts required
- ✅ All data stored locally in your browser
- ✅ Open source and auditable

See our [Privacy Policy](/privacy) for complete details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This project is not affiliated with, endorsed by, or connected to Bungie, Inc. Destiny 2, the Destiny Logo, and related marks are trademarks of Bungie, Inc.

Emblem codes are aggregated from publicly available community sources. Always verify codes at the [official Bungie redemption site](https://www.bungie.net/7/en/Codes/Redeem) before use.

## 🙏 Acknowledgments

- [Bungie](https://www.bungie.net) for creating Destiny 2
- [Blueberries.gg](https://www.blueberries.gg) for maintaining emblem databases
- [Destiny Emblem Collector](https://destinyemblemcollector.com) for the authoritative universal code list
- [Mijago's Rewards](https://rewards.mijago.net) for cross-referenced emblem data
- The Destiny 2 Reddit community for sharing codes
- All Guardians who contribute to keeping the community informed

## 📋 Community Feedback (v2.2.0)

This release directly addresses community feedback from [r/DestinyTheGame](https://www.reddit.com/r/DestinyTheGame/comments/1rewz3y/):

### Issues Fixed
- **Wrong code→emblem mappings** — All 38 original code entries had incorrect emblem name associations (e.g., `YRC-C3D-YNC` was labeled "The Visionary" but is actually "A Classy Order"). Every mapping has been corrected against [destinyemblemcollector.com](https://destinyemblemcollector.com/availability/universalcode), [rewards.mijago.net](https://rewards.mijago.net), and [blueberries.gg](https://www.blueberries.gg/items/destiny-2-free-emblems/).
- **Fabricated codes removed** — 6 codes that never existed as universal codes were removed (`JNX-DMH-XLA`, `A7L-FYC-44X`, `N3L-XN6-PXF`, `X9F-GMA-H6D`, `3VF-LGC-RLX`, `X4C-FGX-MX3`).
- **Non-universal codes marked expired** — 7 codes for emblems that require special access (Game2Give donations, Bungie API developer program, Steelseries promos, Creator Hub, Netcafe vendors) are now marked "Expired" with dependency notes explaining how to actually obtain them.
- **D1 shader codes properly labeled** — `D6T-3JR-CKX`, `7MM-VPD-MHP`, `RXC-9XJ-4MH` are Destiny 1 shaders (Prismatic Expanse, Double Banshee, Oracle 99), not D2 emblems. They now display under a dedicated "D1" filter.
- **Add Code crash fixed** — `Uncaught TypeError: x.toUpperCase is not a function` caused by passing a `RedemptionCode` object where a string was expected.
- **Code validation updated** — Regex now uses Bungie's official character set (`ACDFGHJKLMNPRTVXY34679`) and supports extended 14-character codes for Destiny: Rising promotions.
- **Missing rewards added** — `R9J-79M-J6C` (End of the Rainbow transmat) and `TK7-D3P-FDF` (Rainbow Connection emote) now included.

### New Features
- **D1 Filter** — Combined filter row: All / D2 Active / D2 Expired / D1
- **Dependency Notes** — Expired and D1 cards display explanatory notes about how to obtain the item

## 📋 v2.3.0 Updates

### New Codes
- **`DXL-XHC-X37`** — **Runner** emblem (universal code, available Feb 5, 2026). Confirmed via [destinyemblemcollector.com](https://destinyemblemcollector.com/emblem?id=3079989879).

### Image Fixes
- **Runner emblem** now shows correct Bungie CDN icon
- **End of the Rainbow** and **Rainbow Connection** — removed fabricated icon paths that were 404ing on Bungie CDN. These are a transmat effect and emote (not emblems), so they correctly show a placeholder icon.

### Scraper Improvements
- Reddit and Blueberries.gg scrapers now validate discovered codes against **Bungie's official character set** (`ACDFGHJKLMNPRTVXY34679`), filtering out false matches with characters outside the valid set.

## 📋 v2.4.0 Updates

### UX Improvements
- **Middle-click support on Redeem buttons** — Redeem buttons are now native `<a>` elements instead of `<button>`, enabling middle-click / Ctrl+click to open codes in new browser tabs. Applies to both per-code Redeem buttons and the hero "Redeem on Bungie.net" button.

### Code Quality & Refactoring
- Removed unused imports (`CodeGridSkeleton`, `EmptyState` from Index page)
- Removed dead types (`SortOrder`, unused `sourceUrl` field)
- Removed redundant `description` fields from 48 code entries where they duplicated `emblemName` — `useCodeScanner` now falls back to `emblemName` automatically
- Removed dead default export from `codeScraperService`

### Docker Hardening
- Container now runs as **non-root user** (`appuser`) instead of root
- Nginx listens on **port 8080** (unprivileged) instead of port 80
- Added `server_tokens off` to suppress Nginx version in responses
- Added security headers: `Referrer-Policy`, `Permissions-Policy`
- Improved gzip config with `gzip_vary` and `gzip_min_length`
- Docker Compose example now includes `read_only` and `no-new-privileges`

### Version
- Bumped `package.json` version to **2.4.0**

---

Made with ♥ in Seattle, WA for the Destiny 2 community

**Eyes up, Guardian.** 👁️

