let cart = loadCart();
const quantityHTML = (id, value) => `<div class="quantity"><button data-step="-1" data-id="${id}" aria-label="Зменшити кількість">−</button><input aria-label="Кількість" inputmode="numeric" type="number" min="1" step="1" value="${value}" data-id="${id}"><button data-step="1" data-id="${id}" aria-label="Збільшити кількість">+</button></div>`;

function render() {
 renderCartBadge(cart);
 const selected = window.PANACEA_PRODUCTS.filter(p => cart[p.id]);
 const layout = document.querySelector('.cart-page-layout');
 const summary = document.querySelector('#cart-summary');
 layout.classList.toggle('cart-page-layout-empty', !selected.length);
 summary.hidden = !selected.length;

 document.querySelector('#cart-items').innerHTML = selected.length ? selected.map(p => `
  <article class="cart-item">
   <img src="/assets/products/${p.image}" alt="PANACEA ${p.brand}">
   <div>
    <h3><a href="/product/?id=${p.id}">PANACEA ${p.brand}</a></h3>
    <p>${p.gas} · ${p.material} · 0,5 л</p>
    <div class="buy-row">${quantityHTML(p.id, cart[p.id])}<span>${money(p.price * cart[p.id])}</span></div>
    <button class="remove" data-remove="${p.id}">Видалити</button>
   </div>
  </article>`).join('') : `<div class="empty"><h3>Кошик порожній.</h3><p>Додайте улюблену воду до кошика.</p><a class="button" href="/#products">Обрати воду ↗</a></div>`;

 summary.innerHTML = selected.length ? `
  <h2>Разом</h2>
  <div class="total"><span>Сума</span><strong>${money(selected.reduce((sum, p) => sum + p.price * cart[p.id], 0))}</strong></div>
  <a class="button" style="width:100%;display:flex" href="/checkout/">Оформити замовлення</a>
  <p class="cart-notice" style="margin-top:16px">Онлайн-оплата поки недоступна.<br>Замовити воду можна за телефоном <a href="tel:+380977111077"><u>+38 097 711 10 77</u></a>.<br><small>Ціни попередні. Кошик зберігається на цьому пристрої.</small></p>` : '';
}

document.addEventListener('click', e => {
 const b = e.target.closest('button');
 if (!b) return;
 if (b.dataset.remove) { delete cart[b.dataset.remove]; saveCart(cart); render(); }
 if (b.dataset.step) {
  const next = (cart[b.dataset.id] || 0) + Number(b.dataset.step);
  if (Number.isSafeInteger(next) && next >= 1) { cart[b.dataset.id] = next; saveCart(cart); render(); }
 }
});
document.addEventListener('change', e => {
 const input = e.target;
 if (!input.matches('.quantity input')) return;
 const value = Number(input.value);
 if (Number.isSafeInteger(value) && value >= 1) { cart[input.dataset.id] = value; saveCart(cart); render(); }
});

render();
