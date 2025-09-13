# Giwa Bridge Web

[![CI](https://img.shields.io/badge/ci-manual-lightgrey?logo=githubactions)](https://github.com/0xc05m1c0wl/giwa-bridge/actions/workflows/ci.yml)
[![coverage](https://img.shields.io/badge/coverage-pending-lightgrey?logo=codecov)](https://codecov.io/gh/0xc05m1c0wl/giwa-bridge)
[![Release](https://img.shields.io/badge/release-v0.1.0-blue)](https://github.com/0xc05m1c0wl/giwa-bridge/releases)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Website](https://img.shields.io/website?url=https%3A%2F%2F0xc05m1c0wl.github.io%2Fgiwa-bridge%2F)](https://0xc05m1c0wl.github.io/giwa-bridge/)

Live: https://0xc05m1c0wl.github.io/giwa-bridge/

Lightweight L1↔L2 token bridge UI for Sepolia↔Giwa. Built with React, Vite, TypeScript, wagmi, and viem.

## Preview

[![Giwa Bridge preview](public/hero-giwa-roof-mo.png)](https://0xc05m1c0wl.github.io/giwa-bridge/)

## Features

- Connect wallet and switch chains
- Show balances and allowance state
- Deposit and withdraw with progress and ETA
- Strong typing (TypeScript) and unit/UI tests (Vitest)

## Quickstart

- Requirements: Node.js 20+, pnpm 9+

```bash
pnpm install
pnpm dev
```

Build and verify:

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm build
```

## Configuration

Set environment variables via `.env` or CI. Sensible defaults work out of the box. See `src/config.ts` for the full list and defaults.

- `VITE_RPC_L1` / `VITE_RPC_L2`: RPC endpoints
- `VITE_L1_TOKEN` / `VITE_L2_TOKEN`: test token addresses
- `VITE_L1_BRIDGE` / `VITE_L2_BRIDGE`: bridge contract addresses
- `VITE_EXPLORER_L1` / `VITE_EXPLORER_L2`: block explorer base URLs

## Scripts

- `pnpm dev`: start the dev server
- `pnpm lint`: run ESLint
- `pnpm typecheck`: run TypeScript build-based typecheck
- `pnpm test` / `pnpm test:cov`: run tests (with coverage)
- `pnpm build`: build for production

## Quality & CI

- GitHub Actions: lint, typecheck, test, GitHub Pages deploy
- Codecov upload (token via GitHub Secrets)

## Analytics (Cloudflare Web Analytics)

- Production builds may enable privacy-friendly Cloudflare Web Analytics.
- Privacy:
  - Do Not Track (DNT) respected.
  - Opt-out: add `?no-analytics=1` once (stored in `localStorage`), or set `localStorage.no_analytics = '1'`.
- Configuration:
  - `VITE_CF_BEACON_TOKEN` is injected by CI from repo secret `CF_BEACON_TOKEN`.
- No wallet addresses, hashes, or PII are sent by this app.

## License

MIT License. See `LICENSE` for details.
