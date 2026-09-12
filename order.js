let order = null;
try { order = JSON.parse(localStorage.getItem('panacea-order') || 'null'); } catch {}
renderCartBadge(loadCart());

const statusLabel = { new: 'Нове', processing: 'В обробці', done: 'Виконано' };

if (!order) {
 document.querySelector('#no-order').hidden = false;
} else {
 document.querySelector('#order-view').hidden = false;
 document.querySelector('#order-id').textContent = `Замовлення ${order.id}`;
 document.querySelector('#order-date').textContent = new Date(order.date).toLocaleString('uk-UA', { dateStyle: 'long', timeStyle: 'short' });
 const status = document.querySelector('#order-status');
 status.textContent = statusLabel[order.status] || order.status;
 status.classList.add(`order-status-${order.status}`);

 document.querySelector('#order-details').innerHTML = `
  <dt>Отримувач</dt><dd>${order.name}</dd>
  <dt>Телефон</dt><dd>${order.phone}</dd>
  <dt>Місто</dt><dd>${order.city}</dd>
  <dt>Адреса</dt><dd>${order.address}</dd>
  ${order.comment ? `<dt>Коментар</dt><dd>${order.comment}</dd>` : ''}
  <dt>Оплата</dt><dd>${order.payment}</dd>
 `;

 document.querySelector('#order-lines').innerHTML = order.items.map(i =>
  `<div class="checkout-line"><span>PANACEA ${i.brand} × ${i.quantity}</span><span>${money(i.price * i.quantity)}</span></div>`
 ).join('');
 document.querySelector('#order-total').innerHTML = `<span>Разом</span><strong>${money(order.total)}</strong>`;
}
