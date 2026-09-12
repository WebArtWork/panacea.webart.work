# PANACEA storefront

Ukrainian marketplace-style landing page with six products, product detail pages, cart, checkout, and a static demo admin/CRM section.

Serve the repo root using any static HTTP server, or open `index.html` directly. No dependencies or build step are required.

- `index.html`: catalog/home page and cart drawer.
- `product.html`, `cart.html`, `checkout.html`: product detail, full cart, and static checkout form.
- `styles.css`: responsive brand styling.
- `products.js`: shared product catalog data.
- `app.js`, `cart-utils.js`, `product.js`, `cart-page.js`, `checkout.js`: catalog, cart, and checkout behavior. Prices are provisional (30–45 UAH).
- `assets`: original company assets copied from the supplied project.
- `admin/`: static demo CRM (dashboard, products, orders, customers) with mock data — no backend, nothing persists.
- `CNAME`: custom domain (`panacea.webart.work`) for GitHub Pages.

Scope: landing page and demo admin UI only. Checkout, payments, and real order/customer persistence are not implemented — the checkout page and cart explain this and link to the company phone number.

Validated: JavaScript syntax; local HTTP response for every page and asset; original images load; desktop and 390px mobile layout; cart addition, quantity updates, removal, totals, invalid quantity rejection and persistence after reload; WebMCP registration, valid and invalid input.

Deployment: GitHub Pages configured to build from the `master` branch root (Settings → Pages → Source → "Deploy from a branch").
