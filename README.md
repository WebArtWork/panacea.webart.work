# PANACEA storefront

Ukrainian landing page with six products, quantity controls and a device-local cart.

Serve `dist` using any static HTTP server. No dependencies or build step are required.

- `dist/index.html`: landing page and cart shell.
- `dist/styles.css`: responsive brand styling.
- `dist/app.js`: product catalog and cart behavior. Prices are provisional (30–45 UAH).
- `dist/assets`: original company assets copied from the supplied project.

Scope: landing page only. Checkout, payments, order processing and admin are not implemented. The cart explicitly explains this and links to the company phone number.

Validated: JavaScript syntax; local HTTP response; original images load; desktop and 390px mobile layout; cart addition, quantity updates, removal, totals, invalid quantity rejection and persistence after reload; WebMCP registration, valid and invalid input.

Redesign: compact marketplace header with search, immediate product grid, category/gas/packaging filters, price sorting, responsive mobile filter controls, and brand story below the catalog.
