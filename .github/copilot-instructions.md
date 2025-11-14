# Copilot / AI Agent Instructions — Ecommerce (React + Vite)

Purpose: Provide AI coding agents with essential knowledge for immediate productivity in this repo.

## Quick Start
```bash
npm install    # Install dependencies
npm run dev    # Start dev server (http://localhost:5173)
npm run build  # Production build
npm run lint   # Run ESLint checks
```

## Core Architecture
- Entry: `src/main.jsx` - React Router v7 setup
  ```jsx
  // src/main.jsx pattern
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/products' element={<Products />} />
    </Routes>
  </BrowserRouter>
  ```
- Build: Vite (`vite.config.js`) with `@vitejs/plugin-react` + `@tailwindcss/vite`

- Architecture / big picture
  - Small single-page React app using Vite as bundler and TailwindCSS for styling.
  - Routing: `react-router-dom` (v7+) in `src/main.jsx` — pages live under `src/pages/` and reusable UI under `src/components/`.
  - No global state manager is present. The `Cart` is currently static (`src/pages/Cart.jsx`). Product data is fetched client-side in `src/components/Products.jsx` from `https://fakestoreapi.com/products`.

- Project-specific patterns & conventions
  - Files: pages -> `src/pages/*` (route-level views). Components -> `src/components/*` (reusable UI).
  - Styling: Tailwind utility classes in JSX (see `Navbar.jsx`, `Home.jsx`). Keep classes compact and prefer responsive utilities (e.g., `md:`, `sm:`).
  - Default exports: components/pages use `export default`. New components should follow the same pattern.
  - Icons: `lucide-react` is used for icons (`Navbar.jsx`, `Home.jsx`).

## Data Flow & Integration
- Products data flow:
  ```jsx
  // src/components/Products.jsx pattern
  function Products() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((data) => setProducts(data));
    }, []);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => <ProductCard key={product.id} {...product} />)}
      </div>
    );
  }
  ```
- External API: `https://fakestoreapi.com/products` returns:
  ```typescript
  type Product = {
    id: number;
    title: string;
    price: number;
    image: string;
    // ... other fields
  }
  ```
- Images: Remote URLs (Unsplash, fakestoreapi). Put static assets in `src/assets/`.

## Known Issues & Gotchas (Important!)
  - `src/App.jsx` currently contains a broken import (`Cart from `) and is syntactically invalid — do not base changes off this file. The router in `src/main.jsx` is the canonical routing setup.
  - `src/main.jsx` imports `Products` from `./pages/Products` but an implementation currently exists at `src/components/Products.jsx`. Inspect and resolve duplicates before refactoring.
  - Route path casing is inconsistent: `/Cart` vs `/cart` — normalize to lowercase paths to avoid confusion and platform-specific issues. Note: Windows filesystem is case-insensitive, but CI (Linux) may be case-sensitive.
  - There is no TypeScript or global type enforcement; repo has some `@types/*` dev deps but source is JavaScript. Prefer small, safe changes.

## Common Development Tasks

### Adding a New Feature Page
1. Create page component:
```jsx
// src/pages/NewFeature.jsx
export default function NewFeature() {
  return (
    <div className="py-10 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        New Feature
      </h2>
      {/* Follow spacing/layout from Home.jsx */}
    </div>
  );
}
```

2. Add route in `src/main.jsx`:
```jsx
<Route path='/new-feature' element={<NewFeature />} />
```

3. Add nav link in `src/components/Navbar.jsx`:
```jsx
<li className="hover:text-gray-200 cursor-pointer">New Feature</li>
```

### Quality & Testing
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
