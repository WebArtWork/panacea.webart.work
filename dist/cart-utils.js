const money = value => new Intl.NumberFormat('uk-UA').format(value) + ' ₴';
function loadCart() {
 let cart = {};
 try {
  const saved = JSON.parse(localStorage.getItem('panacea-cart') || '{}');
  for (const p of window.PANACEA_PRODUCTS) if (Number.isSafeInteger(saved[p.id]) && saved[p.id] > 0) cart[p.id] = saved[p.id];
 } catch {}
 return cart;
}
function saveCart(cart) {
 try { localStorage.setItem('panacea-cart', JSON.stringify(cart)); } catch {}
}
function cartCount(cart) {
 return Object.values(cart).reduce((a, b) => a + b, 0);
}
function renderCartBadge(cart) {
 document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = cartCount(cart));
}
