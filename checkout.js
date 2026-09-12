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

 const paymentLabel = { cash: 'Готівкою при отриманні', transfer: 'Переказ на картку', card: 'Оплата карткою онлайн' };

 document.querySelector('#checkout-form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const order = {
   id: 'ORD-' + Date.now().toString(36).toUpperCase(),
   date: new Date().toISOString(),
   status: 'new',
   name: document.querySelector('#name').value.trim(),
   phone: document.querySelector('#phone').value.trim(),
   city: document.querySelector('#city').value.trim(),
   address: document.querySelector('#address').value.trim(),
   comment: document.querySelector('#comment').value.trim(),
   payment: paymentLabel[form.payment.value] || form.payment.value,
   items: selected.map(p => ({ brand: p.brand, gas: p.gas, material: p.material, quantity: cart[p.id], price: p.price })),
   total: selected.reduce((sum, p) => sum + p.price * cart[p.id], 0)
  };
  try { localStorage.setItem('panacea-order', JSON.stringify(order)); } catch {}
  clearCart();
  location.href = '/order/';
 });
}
