const id = new URLSearchParams(location.search).get('id');
const product = window.PANACEA_PRODUCTS.find(p => p.id === id);
let cart = loadCart();
renderCartBadge(cart);

if (!product) {
 document.querySelector('#not-found').hidden = false;
} else {
 document.querySelector('#crumb-name').textContent = `PANACEA ${product.brand}`;
 document.title = `PANACEA ${product.brand} — ${product.gas}, ${product.material.toLowerCase()} | PANACEA`;
 document.querySelector('#product-detail').innerHTML = `
  <div class="product-detail-photo"><img src="assets/products/${product.image}" alt="PANACEA ${product.brand}, ${product.gas.toLowerCase()}, ${product.material.toLowerCase()}, 0,5 л"></div>
  <div class="product-detail-info">
   <p class="product-type">${product.brand === 'Arden' ? 'Мінеральна лікувально-столова' : 'Артезіанська питна вода'}</p>
   <h1>PANACEA ${product.brand}</h1>
   <dl class="product-detail-specs">
    <dt>Газованість</dt><dd>${product.gas}</dd>
    <dt>Паковання</dt><dd>${product.material}</dd>
    <dt>Об'єм</dt><dd>0,5 л</dd>
   </dl>
   <div class="price">${money(product.price)}<small>/ шт.</small></div>
   <div class="buy-row"><div class="quantity"><button data-step="-1" aria-label="Зменшити кількість">−</button><input id="qty" type="number" min="1" step="1" value="1" inputmode="numeric"><button data-step="1" aria-label="Збільшити кількість">+</button></div><button class="add" id="add-to-cart">До кошика <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg></button></div>
   <p class="stock-note">${product.stock > 0 ? `В наявності: ${product.stock} шт.` : 'Тимчасово немає в наявності'}</p>
   <p class="price-note">Ціна попередня. Остаточну вартість уточнюйте під час замовлення.</p>
  </div>`;

 const qtyInput = document.querySelector('#qty');
 document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.step) {
   const next = Number(qtyInput.value) + Number(b.dataset.step);
   if (Number.isSafeInteger(next) && next >= 1) qtyInput.value = next;
  }
  if (b.id === 'add-to-cart') {
   const quantity = Number(qtyInput.value);
   if (!Number.isSafeInteger(quantity) || quantity < 1) return;
   cart[product.id] = (cart[product.id] || 0) + quantity;
   saveCart(cart);
   renderCartBadge(cart);
   const toast = document.querySelector('#toast');
   toast.textContent = `Додано до кошика: ${quantity} шт.`;
   toast.classList.add('show');
   clearTimeout(window.__toastTimer);
   window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }
 });
}
