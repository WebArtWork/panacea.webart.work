const money = v => new Intl.NumberFormat('uk-UA').format(v) + ' ₴';
const statusLabel = { new: 'Нове', processing: 'В обробці', done: 'Виконано' };
document.querySelector('#orders-body').innerHTML = window.PANACEA_MOCK_ORDERS.map(o => `
 <tr>
  <td>${o.id}</td>
  <td>${o.date}</td>
  <td>${o.customer}</td>
  <td>${o.city}</td>
  <td>${o.items}</td>
  <td>${money(o.total)}</td>
  <td><span class="badge ${o.status}">${statusLabel[o.status]}</span></td>
 </tr>
`).join('');
