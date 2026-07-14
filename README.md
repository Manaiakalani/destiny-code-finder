# Destiny 2 Code Vault

A fast, privacy-focused catalogue for finding, copying, and checking Destiny redemption codes.

## Features

- 79 curated Destiny reward codes with availability notes
- Official Bungie and community-sourced reward imagery
- Search by code, reward name, description, or source
- Redeemable, Destiny 1, restricted, and locally pinned views
- Dark, OLED, and light themes
- Responsive catalogue with progressive results
- Local-only pinning with no account or server storage
- Keyboard shortcut: press `/` to focus search

## Catalogue model

The bundled catalogue is manually reviewed against:

- [Bungie](https://www.bungie.net/7/en/Codes/Redeem)
- [Destiny Emblem Collector](https://destinyemblemcollector.com/availability/universalcode)
- [Blueberries.gg](https://www.blueberries.gg/items/destiny-2-free-emblems/)
- [Mijago's Destiny 2 Rewards](https://rewards.mijago.net)
- Public Destiny community reports

The browser does not scrape Reddit or community sites at runtime. “Redeemable” reflects the reviewed catalogue; Bungie always determines final availability and account eligibility.

## Development

Requirements: Node.js 18 or newer.

```powershell
npm install
npm run dev
```

Production checks:

```powershell
npm run lint
npm run build
```

Other scripts:

| Command | Description |
|---|---|
| `npm run preview` | Preview the production build |
| `npm run scrape:emblems` | Refresh Bungie emblem metadata |
| `npm run download:emblems` | Cache emblem images locally |

## Architecture

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- Radix Dialog
- GitHub Pages deployment

The application uses `HashRouter` for GitHub Pages compatibility.

## Privacy

Code Vault uses no accounts, cookies, analytics, or advertising trackers. Theme choice and pinned codes are stored only in browser local storage. Reward images may load from Bungie or Destiny Emblem Collector CDNs, and the Orbitron wordmark font loads from Google Fonts.

See the in-app Privacy page for current details.

## Disclaimer

Code Vault is not affiliated with, endorsed by, or connected to Bungie, Inc. Destiny, Destiny 2, the Destiny logo, and related marks are trademarks of Bungie, Inc.

Always confirm availability on the [official Bungie redemption page](https://www.bungie.net/7/en/Codes/Redeem).
