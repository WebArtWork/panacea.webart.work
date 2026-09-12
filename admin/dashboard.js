const money = v => new Intl.NumberFormat('uk-UA').format(v) + ' ₴';
const orders = window.PANACEA_MOCK_ORDERS;
const products = window.PANACEA_PRODUCTS;
const statusLabel = { new: 'Нове', processing: 'В обробці', done: 'Виконано' };

document.querySelector('#stat-cards').innerHTML = `
 <div class="stat-card"><span>Товарів у каталозі</span><strong>${products.length}</strong></div>
 <div class="stat-card"><span>Замовлень (приклад)</span><strong>${orders.length}</strong></div>
 <div class="stat-card"><span>Дохід за приклад</span><strong>${money(orders.reduce((s, o) => s + o.total, 0))}</strong></div>
 <div class="stat-card"><span>Клієнтів (приклад)</span><strong>${window.PANACEA_MOCK_CUSTOMERS.length}</strong></div>`;

document.querySelector('#recent-orders').innerHTML = orders.slice(0, 5).map(o => `
 <tr><td>${o.id}</td><td>${o.customer}</td><td>${o.items}</td><td>${money(o.total)}</td><td><span class="badge ${o.status}">${statusLabel[o.status]}</span></td></tr>
`).join('');

const lowStock = products.filter(p => p.stock <= 20);
document.querySelector('#low-stock').innerHTML = lowStock.length ? lowStock.map(p => `
 <tr><td>PANACEA ${p.brand} · ${p.gas.toLowerCase()} · ${p.material.toLowerCase()}</td><td>${p.stock} шт.</td><td><span class="badge low">Мало</span></td></tr>
`).join('') : `<tr><td colspan="3">Усі товари в достатній кількості.</td></tr>`;
