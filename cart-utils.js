const money = value => new Intl.NumberFormat('uk-UA').format(value) + ' ₴';
const DEMO_CART = { 'arden-glass': 2, 'diamond-light-glass': 1 };
const DEMO_CUSTOMER = { name: 'Олена Ковальчук', phone: '+38 067 123 45 67', city: 'Київ', address: 'вул. Хрещатик, 22, кв. 5', comment: '', payment: 'Готівкою при отриманні' };
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
function clearCart() {
 try { localStorage.removeItem('panacea-cart'); } catch {}
}
function cartCount(cart) {
 return Object.values(cart).reduce((a, b) => a + b, 0);
}
function renderCartBadge(cart) {
 document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = cartCount(cart));
}
