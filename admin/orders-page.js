const money = v => new Intl.NumberFormat('uk-UA').format(v) + ' ₴';
const statusLabel = { new: 'Нове', processing: 'В обробці', done: 'Виконано' };
const statuses = Object.keys(statusLabel);

function render() {
 document.querySelector('#orders-body').innerHTML = getOrders().map(o => `
  <tr>
   <td>${o.id}</td>
   <td>${o.date}</td>
   <td>${o.customer}</td>
   <td>${o.city}</td>
   <td>${o.items}</td>
   <td>${money(o.total)}</td>
   <td><select class="status-select badge ${o.status}" data-status="${o.id}">${statuses.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${statusLabel[s]}</option>`).join('')}</select></td>
  </tr>
 `).join('');
}

document.addEventListener('change', e => {
 const select = e.target;
 if (!select.matches('[data-status]')) return;
 saveOrderStatus(select.dataset.status, select.value);
 render();
});

render();
