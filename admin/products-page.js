const money = v => new Intl.NumberFormat('uk-UA').format(v) + ' ₴';
const editIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';

function render() {
 document.querySelector('#products-body').innerHTML = getProducts().map(p => `
  <tr>
   <td>PANACEA ${p.brand}</td>
   <td>${p.gas}</td>
   <td>${p.material}</td>
   <td>${money(p.price)}</td>
   <td>${p.stock} шт.</td>
   <td><span class="badge ${p.stock <= 20 ? 'low' : 'ok'}">${p.stock <= 20 ? 'Мало' : 'В наявності'}</span></td>
   <td><button class="icon-btn" data-edit="${p.id}" aria-label="Редагувати товар">${editIcon}</button></td>
  </tr>
 `).join('');
}

const dialog = document.querySelector('#edit-dialog');
document.addEventListener('click', e => {
 const b = e.target.closest('button');
 if (!b) return;
 if (b.dataset.edit) {
  const product = getProducts().find(p => p.id === b.dataset.edit);
  if (!product) return;
  document.querySelector('#edit-id').value = product.id;
  document.querySelector('#edit-name').value = `PANACEA ${product.brand}`;
  document.querySelector('#edit-gas').value = product.gas;
  document.querySelector('#edit-material').value = product.material;
  document.querySelector('#edit-price').value = product.price;
  document.querySelector('#edit-stock').value = product.stock;
  dialog.showModal();
 }
 if (b.id === 'cancel-edit') dialog.close();
});

document.querySelector('#edit-form').addEventListener('submit', e => {
 const id = document.querySelector('#edit-id').value;
 const price = Number(document.querySelector('#edit-price').value);
 const stock = Number(document.querySelector('#edit-stock').value);
 if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) { e.preventDefault(); return; }
 saveProductOverride(id, { gas: document.querySelector('#edit-gas').value, material: document.querySelector('#edit-material').value, price, stock });
 render();
});

render();
