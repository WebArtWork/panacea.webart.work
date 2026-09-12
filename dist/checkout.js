const cart = loadCart();
renderCartBadge(cart);
const selected = window.PANACEA_PRODUCTS.filter(p => cart[p.id]);

if (!selected.length) {
 document.querySelector('#empty-notice').hidden = false;
 document.querySelector('#checkout-form').hidden = true;
} else {
 document.querySelector('#order-lines').innerHTML = selected.map(p =>
  `<div class="checkout-line"><span>PANACEA ${p.brand} × ${cart[p.id]}</span><span>${money(p.price * cart[p.id])}</span></div>`
 ).join('');
 document.querySelector('#order-total').innerHTML = `<span>Разом</span><strong>${money(selected.reduce((sum, p) => sum + p.price * cart[p.id], 0))}</strong>`;

 document.querySelector('#checkout-form').addEventListener('submit', e => {
  e.preventDefault();
  const toast = document.querySelector('#toast');
  toast.textContent = 'Дякуємо! Ми зателефонуємо для підтвердження замовлення.';
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
 });
}
