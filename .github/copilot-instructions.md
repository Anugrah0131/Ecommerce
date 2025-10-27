<!-- .github/copilot-instructions.md -->
# Copilot / AI agent instructions — Ecommerce (React + Vite)

Purpose: give an AI coding agent the minimal, concrete knowledge to be productive in this repo.

- Entry points & scripts
  - Main entry: `src/main.jsx` (router + routes). Prefer editing routes here rather than the broken `src/App.jsx`.
  - Dev/build/preview: see `package.json` scripts: `npm run dev` (vite), `npm run build`, `npm run preview`, `npm run lint`.
  - Vite config: `vite.config.js` (plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`).

- Architecture / big picture
  - Small single-page React app using Vite as bundler and TailwindCSS for styling.
  - Routing: `react-router-dom` (v7+) in `src/main.jsx` — pages live under `src/pages/` and reusable UI under `src/components/`.
  - No global state manager is present. The `Cart` is currently static (`src/pages/Cart.jsx`). Product data is fetched client-side in `src/components/Products.jsx` from `https://fakestoreapi.com/products`.

- Project-specific patterns & conventions
  - Files: pages -> `src/pages/*` (route-level views). Components -> `src/components/*` (reusable UI).
  - Styling: Tailwind utility classes in JSX (see `Navbar.jsx`, `Home.jsx`). Keep classes compact and prefer responsive utilities (e.g., `md:`, `sm:`).
  - Default exports: components/pages use `export default`. New components should follow the same pattern.
  - Icons: `lucide-react` is used for icons (`Navbar.jsx`, `Home.jsx`).

- Integration points & external deps
  - External API: `https://fakestoreapi.com/products` (used by `Products.jsx`). Expect JSON array of products.
  - Images are mostly remote URLs (Unsplash, fakestoreapi). Consider caching or moving static assets into `src/assets/` if needed.

- Known issues & gotchas (important for agents)
  - `src/App.jsx` currently contains a broken import (`Cart from `) and is syntactically invalid — do not base changes off this file. The router in `src/main.jsx` is the canonical routing setup.
  - `src/main.jsx` imports `Products` from `./pages/Products` but an implementation currently exists at `src/components/Products.jsx`. Inspect and resolve duplicates before refactoring.
  - Route path casing is inconsistent: `/Cart` vs `/cart` — normalize to lowercase paths to avoid confusion and platform-specific issues. Note: Windows filesystem is case-insensitive, but CI (Linux) may be case-sensitive.
  - There is no TypeScript or global type enforcement; repo has some `@types/*` dev deps but source is JavaScript. Prefer small, safe changes.

- How to add a new page or component (concrete example)
  1. Create `src/pages/NewPage.jsx` exporting default functional component.
  2. Add route in `src/main.jsx`: `<Route path='/new' element={<NewPage/>} />`.
  3. Add a link in `src/components/Navbar.jsx` (keep consistent classnames and responsive behavior).

- Linting & quality
  - Run `npm run lint` to check ESLint (configuration is minimal). Fix only relevant JS/React rules; avoid reformatting unrelated files.

- Small testing checklist for PRs
  - Start dev server: `npm run dev` and confirm main pages load (Home, Products, Cart route).
  - Verify `Products` fetch succeeds (network call to fakestoreapi). If flaky, stub or mock during automated tests.
  - Confirm no import path errors (fix incorrect paths or duplicate files first).

- Files to inspect for common changes
  - `src/main.jsx` — canonical router and entry.
  - `src/components/Products.jsx` — client fetch + product card pattern.
  - `src/components/Navbar.jsx` — header layout and icon usage.
  - `src/pages/Cart.jsx` — current cart UI (static data, where to wire real state).
  - `vite.config.js`, `package.json` — build, plugin and dependency info.

If anything in these notes is unclear or you want more examples (e.g., how to wire a global cart using context or Redux), tell me which area to expand and I'll iterate.
