const money = v => new Intl.NumberFormat('uk-UA').format(v) + ' ₴';
document.querySelector('#customers-body').innerHTML = window.PANACEA_MOCK_CUSTOMERS.map(c => `
 <tr>
  <td>${c.name}</td>
  <td>${c.phone}</td>
  <td>${c.city}</td>
  <td>${c.orders}</td>
  <td>${money(c.spent)}</td>
 </tr>
`).join('');
