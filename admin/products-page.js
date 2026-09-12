const money = v => new Intl.NumberFormat('uk-UA').format(v) + ' ₴';
document.querySelector('#products-body').innerHTML = window.PANACEA_PRODUCTS.map(p => `
 <tr>
  <td>PANACEA ${p.brand}</td>
  <td>${p.gas}</td>
  <td>${p.material}</td>
  <td>${money(p.price)}</td>
  <td>${p.stock} шт.</td>
  <td><span class="badge ${p.stock <= 20 ? 'low' : 'ok'}">${p.stock <= 20 ? 'Мало' : 'В наявності'}</span></td>
 </tr>
`).join('');
