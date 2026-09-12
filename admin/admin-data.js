function loadJSON(key) {
 try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function saveJSON(key, value) {
 try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function getProducts() {
 const overrides = loadJSON('panacea-admin-products');
 return window.PANACEA_PRODUCTS.map(p => ({ ...p, ...(overrides[p.id] || {}) }));
}
function saveProductOverride(id, data) {
 const overrides = loadJSON('panacea-admin-products');
 overrides[id] = { ...overrides[id], ...data };
 saveJSON('panacea-admin-products', overrides);
}
function getOrders() {
 const overrides = loadJSON('panacea-admin-orders');
 return window.PANACEA_MOCK_ORDERS.map(o => ({ ...o, ...(overrides[o.id] || {}) }));
}
function saveOrderStatus(id, status) {
 const overrides = loadJSON('panacea-admin-orders');
 overrides[id] = { ...overrides[id], status };
 saveJSON('panacea-admin-orders', overrides);
}
