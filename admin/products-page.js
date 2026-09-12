const money = v => new Intl.NumberFormat('uk-UA').format(v) + ' ₴';
const editIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
const deleteIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>';

function render() {
 document.querySelector('#products-body').innerHTML = getProducts().map(p => `
  <tr>
   <td>PANACEA ${p.brand}</td>
   <td>${p.gas}</td>
   <td>${p.material}</td>
   <td>${money(p.price)}</td>
   <td>${p.stock} шт.</td>
   <td><span class="badge ${p.stock <= 20 ? 'low' : 'ok'}">${p.stock <= 20 ? 'Мало' : 'В наявності'}</span></td>
   <td><div class="row-actions">
    <button class="icon-btn" data-edit="${p.id}" aria-label="Редагувати товар">${editIcon}</button>
    <button class="icon-btn danger" data-delete="${p.id}" aria-label="Видалити товар">${deleteIcon}</button>
   </div></td>
  </tr>
 `).join('');
}

const dialog = document.querySelector('#edit-dialog');
const form = document.querySelector('#edit-form');

function openDialog(product) {
 document.querySelector('#dialog-title').textContent = product ? 'Редагувати товар' : 'Новий товар';
 document.querySelector('#edit-id').value = product ? product.id : '';
 document.querySelector('#edit-brand').value = product ? product.brand : '';
 document.querySelector('#edit-gas').value = product ? product.gas : 'Негазована';
 document.querySelector('#edit-material').value = product ? product.material : 'Скло';
 document.querySelector('#edit-price').value = product ? product.price : '';
 document.querySelector('#edit-stock').value = product ? product.stock : '';
 dialog.showModal();
}

document.querySelector('#add-product').addEventListener('click', () => openDialog(null));

document.addEventListener('click', e => {
 const b = e.target.closest('button');
 if (!b) return;
 if (b.dataset.edit) {
  const product = getProducts().find(p => p.id === b.dataset.edit);
  if (product) openDialog(product);
 }
 if (b.dataset.delete) {
  const product = getProducts().find(p => p.id === b.dataset.delete);
  if (product && confirm(`Видалити товар PANACEA ${product.brand} (${product.gas.toLowerCase()}, ${product.material.toLowerCase()})? Цю дію не можна скасувати.`)) {
   deleteProduct(product.id);
   render();
  }
 }
 if (b.id === 'cancel-edit') dialog.close();
});

form.addEventListener('submit', e => {
 const id = document.querySelector('#edit-id').value;
 const brand = document.querySelector('#edit-brand').value.trim();
 const price = Number(document.querySelector('#edit-price').value);
 const stock = Number(document.querySelector('#edit-stock').value);
 if (!brand || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) { e.preventDefault(); return; }
 const data = { brand, gas: document.querySelector('#edit-gas').value, material: document.querySelector('#edit-material').value, price, stock };
 if (id) saveProductOverride(id, data);
 else addProduct({ ...data, category: '', image: 'diamond-1.webp' });
 render();
});

render();
