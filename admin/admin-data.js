function loadJSON(key, fallback) {
 try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}
function saveJSON(key, value) {
 try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function getProducts() {
 const overrides = loadJSON('panacea-admin-products', {});
 const added = loadJSON('panacea-admin-products-added', []);
 const deleted = loadJSON('panacea-admin-products-deleted', []);
 const base = window.PANACEA_PRODUCTS.filter(p => !deleted.includes(p.id));
 return [...base, ...added].map(p => ({ ...p, ...(overrides[p.id] || {}) }));
}
function saveProductOverride(id, data) {
 const overrides = loadJSON('panacea-admin-products', {});
 overrides[id] = { ...overrides[id], ...data };
 saveJSON('panacea-admin-products', overrides);
}
function addProduct(data) {
 const added = loadJSON('panacea-admin-products-added', []);
 const slug = data.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
 added.push({ id: slug, ...data });
 saveJSON('panacea-admin-products-added', added);
 return slug;
}
function deleteProduct(id) {
 const added = loadJSON('panacea-admin-products-added', []);
 if (added.some(p => p.id === id)) {
  saveJSON('panacea-admin-products-added', added.filter(p => p.id !== id));
  return;
 }
 const deleted = loadJSON('panacea-admin-products-deleted', []);
 if (!deleted.includes(id)) { deleted.push(id); saveJSON('panacea-admin-products-deleted', deleted); }
}
function getOrders() {
 const overrides = loadJSON('panacea-admin-orders', {});
 return window.PANACEA_MOCK_ORDERS.map(o => ({ ...o, ...(overrides[o.id] || {}) }));
}
function saveOrderStatus(id, status) {
 const overrides = loadJSON('panacea-admin-orders', {});
 overrides[id] = { ...overrides[id], status };
 saveJSON('panacea-admin-orders', overrides);
}
